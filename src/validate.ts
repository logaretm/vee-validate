import { RuleContainer } from './extend';
import { isObject, isNullOrUndefined, normalizeRules, isEmptyArray, interpolate } from './utils';
import { ValidationResult, RuleParamSchema, ValidationRuleSchema, ValidationMessageTemplate } from './types';
import { getConfig } from './config';

interface FieldMeta {
  name: string;
  rules: { [k: string]: any[] };
  bails: boolean;
  forceRequired: boolean;
  crossTable: { [k: string]: any };
  names: { [k: string]: any };
}

/**
 * Validates a value against the rules.
 */
export async function validate(
  value: any,
  rules: string | { [k: string]: any },
  options: any = {}
): Promise<ValidationResult> {
  const shouldBail = options && options.bails;
  const field: FieldMeta = {
    name: (options && options.name) || '{field}',
    rules: normalizeRules(rules),
    bails: isNullOrUndefined(shouldBail) ? true : shouldBail,
    forceRequired: false,
    crossTable: options && options.values,
    names: (options && options.names) || {}
  };

  const result = await _validate(field, value, options);
  const errors: string[] = [];
  const ruleMap: { [k: string]: string } = {};
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
async function _validate(field: FieldMeta, value: any, { isInitial = false } = {}) {
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
    if (isInitial && !RuleContainer.isImmediate(rules[i])) {
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

async function _shouldSkip(field: FieldMeta, value: any) {
  const requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);
  const length = requireRules.length;
  const errors: ReturnType<typeof _generateFieldError>[] = [];
  let isRequired = false;
  for (let i = 0; i < length; i++) {
    let rule = requireRules[i];
    let result = await _test(field, value, {
      name: rule,
      params: field.rules[rule]
    });

    if (!isObject(result)) {
      throw new Error('Require rules has to return an object (see docs)');
    }

    if (result.data.required) {
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

  // field is configured to run through the pipeline regardless
  if (!field.bails) {
    return {
      shouldSkip: false,
      errors
    };
  }

  // skip if the field is not required and has an empty value.
  return {
    shouldSkip: !isRequired && (isNullOrUndefined(value) || value === '' || isEmptyArray(value)),
    errors
  };
}

/**
 * Tests a single input value against a rule.
 */
async function _test(field: FieldMeta, value: any, rule: { name: string; params: any[] | object }) {
  const ruleSchema = RuleContainer.getRuleDefinition(rule.name);
  if (!ruleSchema.validate) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  // build params
  const params = _buildParams(rule.params, ruleSchema.params, field.crossTable);
  let result = await ruleSchema.validate(value, params);
  if (!isObject(result)) {
    result = { valid: result, data: {} };
  }

  return {
    valid: result.valid,
    data: result.data || {},
    errors: result.valid ? [] : [_generateFieldError(field, ruleSchema, rule.name, params, result.data)]
  };
}

/**
 * Generates error messages.
 */
function _generateFieldError(
  field: FieldMeta,
  ruleSchema: ValidationRuleSchema,
  ruleName: string,
  params: { [k: string]: any },
  data: any
) {
  const values = {
    ...(params ? params : {}),
    ...(data ? data : {})
  };

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

function _normalizeMessage(template: ValidationMessageTemplate, field: string, values: { [k: string]: any }) {
  if (typeof template === 'function') {
    return template(field, values);
  }

  return interpolate(template, { ...values, _field_: field });
}

function _buildParams(
  provided: any[] | { [k: string]: any },
  defined: RuleParamSchema[] | undefined,
  crossTable: { [k: string]: any }
) {
  const params: { [k: string]: any } = {};
  if (!defined && !Array.isArray(provided)) {
    throw new Error('You provided an object params to a rule that has no defined schema.');
  }

  // Rule probably uses an array for their args, keep it as is.
  if (Array.isArray(provided) && !defined) {
    return provided;
  }

  let definedRules: RuleParamSchema[];
  // collect the params schema.
  if (!defined || defined.length < provided.length) {
    let lastDefinedParam: RuleParamSchema;
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
      // map it from the object if it exists.
      value = options.name in provided ? provided[options.name] : value;
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
