import { ValidationRule, ValidationRuleSchema, RuleParamConfig } from './types';
import { isCallable, merge } from './utils';

interface NormalizedRuleSchema extends ValidationRuleSchema {
  params?: RuleParamConfig[];
}

const RULES: { [k: string]: NormalizedRuleSchema } = {};

type RuleIterateFn = (ruleName: string, schema: NormalizedRuleSchema) => any;

function normalizeSchema(schema: ValidationRuleSchema): NormalizedRuleSchema {
  if (schema.params && schema.params.length) {
    schema.params = schema.params.map(param => {
      if (typeof param === 'string') {
        return { name: param };
      }

      return param;
    });
  }

  return schema as NormalizedRuleSchema;
}

export class RuleContainer {
  public static extend(name: string, schema: ValidationRuleSchema) {
    // if rule already exists, overwrite it.
    const rule = normalizeSchema(schema);
    if (RULES[name]) {
      RULES[name] = merge(RULES[name], schema);
      return;
    }

    RULES[name] = {
      lazy: false,
      computesRequired: false,
      ...rule
    };
  }

  public static iterate(fn: RuleIterateFn) {
    const keys = Object.keys(RULES);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      fn(keys[i], RULES[keys[i]]);
    }
  }

  public static isLazy(name: string) {
    return !!(RULES[name] && RULES[name].lazy);
  }

  public static isRequireRule(name: string) {
    return !!(RULES[name] && RULES[name].computesRequired);
  }

  public static isTargetRule(name: string) {
    const definition = RuleContainer.getRuleDefinition(name);
    if (!definition || !definition.params) {
      return false;
    }

    return definition.params.some(param => !!param.isTarget);
  }

  public static getRuleDefinition(ruleName: string) {
    return RULES[ruleName];
  }
}

/**
 * Adds a custom validator to the list of validation rules.
 */
export function extend(name: string, schema: ValidationRule) {
  // makes sure new rules are properly formatted.
  guardExtend(name, schema);

  // Full schema object.
  if (typeof schema === 'object') {
    RuleContainer.extend(name, schema);
    return;
  }

  RuleContainer.extend(name, {
    validate: schema
  });
}

/**
 * Guards from extension violations.
 */
function guardExtend(name: string, validator: ValidationRule) {
  if (isCallable(validator)) {
    return;
  }

  if (isCallable(validator.validate)) {
    return;
  }

  if (RuleContainer.getRuleDefinition(name)) {
    return;
  }

  throw new Error(`Extension Error: The validator '${name}' must be a function or have a 'validate' method.`);
}
