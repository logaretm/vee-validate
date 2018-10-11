const RULES = {};

export default class RuleContainer {
  static add (name, { validate, options, paramNames }) {
    RULES[name] = {
      validate,
      options,
      paramNames
    };
  }

  static get rules () {
    return RULES;
  }

  static has (name) {
    return !!RULES[name];
  }

  static isImmediate (name) {
    return !!(RULES[name] && RULES[name].options.immediate);
  }

  static isTargetRule (name) {
    return !!(RULES[name] && RULES[name].options.hasTarget);
  }

  static remove (ruleName) {
    delete RULES[ruleName];
  }

  static getParamNames (ruleName) {
    return RULES[ruleName] && RULES[ruleName].paramNames;
  }

  static getOptions (ruleName) {
    return RULES[ruleName] && RULES[ruleName].options;
  }

  static getValidatorMethod (ruleName) {
    return RULES[ruleName] ? RULES[ruleName].validate : null;
  }
};
