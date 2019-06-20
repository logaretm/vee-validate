import { ValidationRule, ValidationRuleSchema } from './types';
import { isCallable, merge } from './utils';

const RULES: { [k: string]: ValidationRuleSchema } = {};

type RuleIterateFn = (ruleName: string, schema: ValidationRuleSchema) => any;

export class RuleContainer {
  static extend(name: string, schema: ValidationRuleSchema) {
    // if rule already exists, overwrite it.
    let rule: ValidationRuleSchema;
    if (RULES[name]) {
      rule = merge(RULES[name], schema);
    } else {
      rule = {
        immediate: true,
        computesRequired: false,
        ...schema
      };
    }

    RULES[name] = rule;
  }

  static iterate(fn: RuleIterateFn) {
    const keys = Object.keys(RULES);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      fn(keys[i], RULES[keys[i]]);
    }
  }

  static isImmediate(name: string) {
    return !!(RULES[name] && RULES[name].immediate);
  }

  static isRequireRule(name: string) {
    return !!(RULES[name] && RULES[name].computesRequired);
  }

  static isTargetRule(name: string) {
    const definition = RuleContainer.getRuleDefinition(name);
    if (!definition.params) {
      return false;
    }

    return definition.params.some(param => !!param.isTarget);
  }

  static getRuleDefinition(ruleName: string) {
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
