import { ValidationRule, ValidationRuleSchema } from './types';
import { isCallable, merge } from './utils';

interface NormalizedRuleSchema extends ValidationRuleSchema {
  params?: string[];
}

const RULES: { [k: string]: NormalizedRuleSchema } = {};

export class RuleContainer {
  public static extend(name: string, schema: ValidationRuleSchema) {
    // if rule already exists, overwrite it.
    if (RULES[name]) {
      RULES[name] = merge(RULES[name], schema);
      return;
    }

    RULES[name] = {
      ...schema,
    };
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
    validate: schema,
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
