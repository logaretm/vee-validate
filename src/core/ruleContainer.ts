import { ValidationRuleSchema } from '../types';
import { merge } from '../utils';

const RULES: { [k: string]: ValidationRuleSchema } = {};

export default class RuleContainer {
  static extend(name: string, schema: ValidationRuleSchema) {
    // Rule already exists.
    let rule = {
      ...{ immediate: true, computesRequired: false },
      ...schema
    };

    // rule already exists, overwrite it.
    if (RULES[name]) {
      rule = merge(RULES[name], rule);
    }

    RULES[name] = rule;
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
