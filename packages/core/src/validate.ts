import { RuleContainer } from './extend';
import { interpolate, isLocator, isObject, normalizeRules } from './utils';
import { getConfig } from './config';
import { ValidationMessageGenerator, ValidationMessageTemplate, ValidationResult, ValidationRuleSchema } from './types';

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
  const shouldBail = options?.bails;
  const skipIfEmpty = options?.skipIfEmpty;
  const field: FieldContext = {
    name: options?.name || '{field}',
    rules: normalizeRules(rules),
    bails: shouldBail ?? true,
    skipIfEmpty: skipIfEmpty ?? true,
    forceRequired: false,
    crossTable: options?.values || {},
    names: options?.names || {},
    customMessages: options?.customMessages || {},
  };

  const result = await _validate(field, value);
  const errors: string[] = [];
  const failedRules: Record<string, string> = {};
  // holds a fn that regenerates the message.
  const regenerateMap: Record<string, () => string> = {};
  result.errors.forEach(e => {
    const msg = e.msg();
    errors.push(msg);
    failedRules[e.rule] = msg;
    regenerateMap[e.rule] = e.msg;
  });

  return {
    valid: result.valid,
    errors,
    failedRules,
    regenerateMap,
  };
}

/**
 * Starts the validation process.
 */
async function _validate(field: FieldContext, value: any) {
  const errors: ReturnType<typeof _generateFieldError>[] = [];

  const rules = Object.keys(field.rules);
  const length = rules.length;
  for (let i = 0; i < length; i++) {
    const rule = rules[i];
    const result = await _test(field, value, {
      name: rule,
      params: field.rules[rule],
    });

    if (!result.valid && result.error) {
      errors.push(result.error);
      if (field.bails) {
        return {
          valid: false,
          errors,
        };
      }
    }
  }

  return {
    valid: !errors.length,
    errors,
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

  const params = fillTargetValues(rule.params, field.crossTable);
  let result = await ruleSchema.validate(value, params);
  if (typeof result === 'string') {
    const values = {
      ...(params || {}),
      _field_: field.name,
      _value_: value,
      _rule_: rule.name,
    };

    return {
      valid: false,
      error: { rule: rule.name, msg: () => interpolate(result as string, values) },
    };
  }

  if (!isObject(result)) {
    result = { valid: result };
  }

  return {
    valid: result.valid,
    required: result.required,
    error: result.valid ? undefined : _generateFieldError(field, value, ruleSchema, rule.name, params),
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
  params: Record<string, any>
) {
  const message = field.customMessages[ruleName] || ruleSchema.message;
  const ruleTargets = _getRuleTargets(field, ruleSchema, ruleName);
  const { userTargets, userMessage } = _getUserTargets(field, ruleSchema, ruleName, message);
  const values = {
    ...(params || {}),
    _field_: field.name,
    _value_: value,
    _rule_: ruleName,
    ...ruleTargets,
    ...userTargets,
  };

  return {
    msg: () => _normalizeMessage(userMessage || getConfig().defaultMessage, field.name, values),
    rule: ruleName,
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

  const names: Record<string, string> = {};
  let ruleConfig = field.rules[ruleName];
  if (!Array.isArray(ruleConfig) && isObject(ruleConfig)) {
    ruleConfig = params.map((param: any) => {
      return ruleConfig[param.name];
    });
  }

  for (let index = 0; index < params.length; index++) {
    const param = params[index];
    let key = ruleConfig[index];
    if (!isLocator(key)) {
      continue;
    }

    key = key.__locatorRef;
    const name = field.names[key] || key;
    names[param] = name;
    names[`_${param}_`] = field.crossTable[key];
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
  const rules: Record<string, any> = field.rules[ruleName];
  const params: string[] = ruleSchema.params || [];

  // early return if no rules
  if (!rules) {
    return {};
  }

  // check all rules to convert targets
  Object.keys(rules).forEach((key: string, index: number) => {
    // get the rule
    const rule: any = rules[key];
    if (!isLocator(rule)) {
      return {};
    }

    // get associated parameter
    const param: any = params[index];
    if (!param) {
      return {};
    }

    // grab the name of the target
    const name = rule.__locatorRef;
    userTargets[param.name] = field.names[name] || name;
    userTargets[`_${param.name}_`] = field.crossTable[name];
  });

  return {
    userTargets,
    userMessage,
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
