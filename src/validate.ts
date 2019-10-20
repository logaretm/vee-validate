import { RuleContainer } from './extend';
import { isObject, isNullOrUndefined, normalizeRules, isEmptyArray, interpolate, isLocator } from './utils';
import {
  ValidationResult,
  ValidationRuleSchema,
  ValidationMessageTemplate,
  RuleParamConfig,
  ValidationMessageGenerator,
  RuleParamSchema
} from './types';
import { getConfig } from './config';

interface FieldContext {
  name: string;
  rules: Record<string, any>;
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

    if (!result.valid && result.error) {
      errors.push(result.error);
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

    if (!result.valid && result.error) {
      errors.push(result.error);
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
async function _test(field: FieldContext, value: any, rule: { name: string; params: Record<string, any> }) {
  const ruleSchema = RuleContainer.getRuleDefinition(rule.name);
  if (!ruleSchema || !ruleSchema.validate) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  const normalizedValue = ruleSchema.castValue ? ruleSchema.castValue(value) : value;
  const params = fillTargetValues(rule.params, field.crossTable);

  let result = await ruleSchema.validate(normalizedValue, params);
  if (typeof result === 'string') {
    const values = {
      ...(params || {}),
      _field_: field.name,
      _value_: value,
      _rule_: rule.name
    };

    return {
      valid: false,
      error: { rule: rule.name, msg: interpolate(result, values) }
    };
  }

  if (!isObject(result)) {
    result = { valid: result, data: {} };
  }

  return {
    valid: result.valid,
    required: result.required,
    data: result.data || {},
    error: result.valid ? undefined : _generateFieldError(field, value, ruleSchema, rule.name, params, result.data)
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
  const message = field.customMessages[ruleName] || ruleSchema.message;
  const ruleTargets = _getRuleTargets(field, ruleSchema, ruleName);
  const { userTargets, userMessage } = _getUserTargets(field, ruleSchema, ruleName, message);
  const values = {
    ...(params || {}),
    ...(data || {}),
    _field_: field.name,
    _value_: value,
    _rule_: ruleName,
    ...ruleTargets,
    ...userTargets
  };

  return {
    msg: _normalizeMessage(userMessage || getConfig().defaultMessage, field.name, values),
    rule: ruleName
  };
}

function _getRuleTargets(
  field: FieldContext,
  ruleSchema: ValidationRuleSchema,
  ruleName: string
): Record<string, string> {
  const params = ruleSchema.params;
  if (!params) {
    return {};
  }

  const numTargets = params.filter(param => (param as RuleParamConfig).isTarget).length;
  if (numTargets <= 0) {
    return {};
  }

  const names: Record<string, string> = {};
  let ruleConfig = field.rules[ruleName];
  if (!Array.isArray(ruleConfig) && isObject(ruleConfig)) {
    ruleConfig = params.map((param: any) => {
      return ruleConfig[param.name];
    });
  }

  for (let index = 0; index < params.length; index++) {
    const param: RuleParamConfig = params[index] as RuleParamConfig;
    if (!param.isTarget) {
      continue;
    }

    let key = ruleConfig[index];
    if (isLocator(key)) {
      key = key.__locatorRef;
    }

    const name = field.names[key] || key;
    if (numTargets === 1) {
      names._target_ = name;
      break;
    }

    names[`_${param.name}Target_`] = name;
  }

  return names;
}

function _getUserTargets(
  field: FieldContext,
  ruleSchema: ValidationRuleSchema,
  ruleName: string,
  userMessage: string | ValidationMessageGenerator | undefined
) {
  const userTargets: any = {};
  const values: Record<string, any> = field.rules[ruleName];
  const params: RuleParamSchema[] = ruleSchema.params || [];

  if (values) {
    // check to see if any are targets
    Object.keys(values).forEach((key: string, index: number) => {
      // variables
      const value: any = values[key];

      // user targets start with @
      if (typeof value === 'string' && value.startsWith('@')) {
        // get associated parameter
        const param: any = params[index];
        if (param) {
          // grab the name of the target
          const key = value.substr(1);
          const placeholder = `_${key}Target_`;
          userTargets[placeholder] = field.names[key] || key;

          // update template if it's a string
          if (typeof userMessage === 'string') {
            const rx = new RegExp(`{${param.name}}`, 'g');
            userMessage = userMessage.replace(rx, `{${placeholder}}`);
          }
        }
      }
    });
  }

  return {
    userTargets,
    userMessage
  };
}

function _normalizeMessage(template: ValidationMessageTemplate, field: string, values: Record<string, any>) {
  if (typeof template === 'function') {
    return template(field, values);
  }

  return interpolate(template, { ...values, _field_: field });
}

function fillTargetValues(params: Record<string, any>, crossTable: Record<string, any>) {
  if (Array.isArray(params)) {
    return params;
  }

  const values: typeof params = {};
  const normalize = (value: any) => {
    if (isLocator(value)) {
      return value(crossTable);
    }

    return value;
  };

  Object.keys(params).forEach(param => {
    values[param] = normalize(params[param]);
  });

  return values;
}
