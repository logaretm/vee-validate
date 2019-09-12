import { RuleContainer } from './extend';
import { isObject, isNullOrUndefined, normalizeRules, isEmptyArray, interpolate } from './utils';
import { ValidationResult, ValidationRuleSchema, ValidationMessageTemplate, RuleParamConfig } from './types';
import { getConfig } from './config';

interface FieldContext {
  name: string;
  rules: Record<string, any[]>;
  bails: boolean;
  skipIfEmpty: boolean;
  forceRequired: boolean;
  crossTable: Record<string, any>;
  names: Record<string, string>;
  customMessages: Record<string, string>;
}

interface ValidationOptions {
  name?: string;
  values?: Record<string, any>;
  names?: Record<string, string>;
  bails?: boolean;
  skipIfEmpty?: boolean;
  isInitial?: boolean;
  customMessages?: Record<string, string>;
}

/**
 * Validates a value against the rules.
 */
export async function validate(
  value: any,
  rules: string | Record<string, any>,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const shouldBail = options && options.bails;
  const skipIfEmpty = options && options.skipIfEmpty;
  const field: FieldContext = {
    name: (options && options.name) || '{field}',
    rules: normalizeRules(rules),
    bails: isNullOrUndefined(shouldBail) ? true : shouldBail,
    skipIfEmpty: isNullOrUndefined(skipIfEmpty) ? true : skipIfEmpty,
    forceRequired: false,
    crossTable: (options && options.values) || {},
    names: (options && options.names) || {},
    customMessages: (options && options.customMessages) || {}
  };

  const result = await _validate(field, value, options);
  const errors: string[] = [];
  const ruleMap: Record<string, string> = {};
  result.errors.forEach(e => {
    errors.push(e.msg);
    ruleMap[e.rule] = e.msg;
  });

  return {
    valid: result.valid,
    errors,
    failedRules: ruleMap
  };
}

/**
 * Starts the validation process.
 */
async function _validate(field: FieldContext, value: any, { isInitial = false } = {}) {
  const { shouldSkip, errors } = await _shouldSkip(field, value);
  if (shouldSkip) {
    return {
      valid: !errors.length,
      errors
    };
  }

  // Filter out non-require rules since we already checked them.
  const rules = Object.keys(field.rules).filter(rule => !RuleContainer.isRequireRule(rule));
  const length = rules.length;
  for (let i = 0; i < length; i++) {
    if (isInitial && RuleContainer.isLazy(rules[i])) {
      continue;
    }

    const rule = rules[i];
    const result = await _test(field, value, {
      name: rule,
      params: field.rules[rule]
    });

    if (!result.valid) {
      errors.push(...result.errors);
      if (field.bails) {
        return {
          valid: false,
          errors
        };
      }
    }
  }

  return {
    valid: !errors.length,
    errors
  };
}

async function _shouldSkip(field: FieldContext, value: any) {
  const requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);
  const length = requireRules.length;
  const errors: ReturnType<typeof _generateFieldError>[] = [];
  const isEmpty = isNullOrUndefined(value) || value === '' || isEmptyArray(value);
  const isEmptyAndOptional = isEmpty && field.skipIfEmpty;
  let isRequired = false;

  for (let i = 0; i < length; i++) {
    const rule = requireRules[i];
    const result = await _test(field, value, {
      name: rule,
      params: field.rules[rule]
    });

    if (!isObject(result)) {
      throw new Error('Require rules has to return an object (see docs)');
    }

    if (result.required) {
      isRequired = true;
    }

    if (!result.valid) {
      errors.push(...result.errors);
      // Exit early as the field is required and failed validation.
      if (field.bails) {
        return {
          shouldSkip: true,
          errors
        };
      }
    }
  }

  if (isEmpty && !isRequired && !field.skipIfEmpty) {
    return {
      shouldSkip: false,
      errors
    };
  }

  // field is configured to run through the pipeline regardless
  if (!field.bails && !isEmptyAndOptional) {
    return {
      shouldSkip: false,
      errors
    };
  }

  // skip if the field is not required and has an empty value.
  return {
    shouldSkip: !isRequired && isEmpty,
    errors
  };
}

/**
 * Tests a single input value against a rule.
 */
async function _test(field: FieldContext, value: any, rule: { name: string; params: any[] | object }) {
  const ruleSchema = RuleContainer.getRuleDefinition(rule.name);
  if (!ruleSchema || !ruleSchema.validate) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  // build params
  const params = _buildParams(rule.params, ruleSchema.params, field.crossTable);
  const normalizedValue = ruleSchema.castValue ? ruleSchema.castValue(value) : value;
  let result = await ruleSchema.validate(normalizedValue, params);
  if (!isObject(result)) {
    result = { valid: result, data: {} };
  }

  return {
    valid: result.valid,
    required: result.required,
    data: result.data || {},
    errors: result.valid ? [] : [_generateFieldError(field, value, ruleSchema, rule.name, params, result.data)]
  };
}

/**
 * Generates error messages.
 */
function _generateFieldError(
  field: FieldContext,
  value: any,
  ruleSchema: ValidationRuleSchema,
  ruleName: string,
  params: Record<string, any>,
  data?: Record<string, any>
) {
  const values = {
    ...(params || {}),
    ...(data || {}),
    _field_: field.name,
    _value_: value,
    _rule_: ruleName
  };

  if (
    Object.prototype.hasOwnProperty.call(field.customMessages, ruleName) &&
    typeof field.customMessages[ruleName] === 'string'
  ) {
    return {
      msg: _normalizeMessage(field.customMessages[ruleName], field.name, values),
      rule: ruleName
    };
  }

  if (ruleSchema.message) {
    return {
      msg: _normalizeMessage(ruleSchema.message, field.name, values),
      rule: ruleName
    };
  }

  return {
    msg: _normalizeMessage(getConfig().defaultMessage, field.name, values),
    rule: ruleName
  };
}

function _normalizeMessage(template: ValidationMessageTemplate, field: string, values: Record<string, any>) {
  if (typeof template === 'function') {
    return template(field, values);
  }

  return interpolate(template, { ...values, _field_: field });
}

function _buildParams(
  provided: any[] | Record<string, any>,
  defined: RuleParamConfig[] | undefined,
  crossTable: Record<string, any>
) {
  const params: Record<string, any> = {};
  if (!defined && !Array.isArray(provided)) {
    throw new Error('You provided an object params to a rule that has no defined schema.');
  }

  // Rule probably uses an array for their args, keep it as is.
  if (Array.isArray(provided) && !defined) {
    return provided;
  }

  let definedRules: RuleParamConfig[];
  // collect the params schema.
  if (!defined || defined.length < provided.length) {
    let lastDefinedParam: RuleParamConfig;
    // collect any additional parameters in the last item.
    definedRules = provided.map((_: any, idx: number) => {
      let param = defined && defined[idx];
      lastDefinedParam = param || lastDefinedParam;
      if (!param) {
        param = lastDefinedParam;
      }

      return param;
    });
  } else {
    definedRules = defined;
  }

  // Match the provided array length with a temporary schema.
  for (let i = 0; i < definedRules.length; i++) {
    const options = definedRules[i];
    let value = options.default;
    // if the provided is an array, map element value.
    if (Array.isArray(provided)) {
      if (i in provided) {
        value = provided[i];
      }
    } else {
      // If the param exists in the provided object.
      if (options.name in provided) {
        value = provided[options.name];
        // if the provided is the first param value.
      } else if (definedRules.length === 1) {
        value = provided;
      }
    }

    // if the param is a target, resolve the target value.
    if (options.isTarget) {
      value = crossTable[value];
    }

    // If there is a transformer defined.
    if (options.cast) {
      value = options.cast(value);
    }

    // already been set, probably multiple values.
    if (params[options.name]) {
      params[options.name] = Array.isArray(params[options.name]) ? params[options.name] : [params[options.name]];
      params[options.name].push(value);
    } else {
      // set the value.
      params[options.name] = value;
    }
  }

  return params;
}
