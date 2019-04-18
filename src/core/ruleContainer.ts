import { ValidationRuleSchema } from "../types";

const RULES: { [k: string]: ValidationRuleSchema } = {};

export default class RuleContainer {
  static add (name: string, { validate, options, paramNames }: ValidationRuleSchema) {
    RULES[name] = {
      validate,
      options,
      paramNames
    };
  }

  static isImmediate (name: string) {
    return !!(RULES[name] && RULES[name].options.immediate);
  }

  static isRequireRule (name: string) {
    return !!(RULES[name] && RULES[name].options.computesRequired);
  }

  static isTargetRule (name: string) {
    return !!(RULES[name] && RULES[name].options.hasTarget);
  }

  static remove (ruleName: string) {
    delete RULES[ruleName];
  }

  static getParamNames (ruleName: string) {
    return RULES[ruleName] && RULES[ruleName].paramNames;
  }

  static getOptions (ruleName: string) {
    return RULES[ruleName] && RULES[ruleName].options;
  }

  static getValidatorMethod (ruleName: string) {
    return RULES[ruleName] ? RULES[ruleName].validate : null;
  }
};
