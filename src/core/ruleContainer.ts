import { ValidationRuleSchema } from '../types';
import { merge } from '../utils';

const RULES: { [k: string]: ValidationRuleSchema } = {};

type RuleIterateFn = (ruleName: string, schema: ValidationRuleSchema) => any;

export default class RuleContainer {
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
