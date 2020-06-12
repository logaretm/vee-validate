import { isCallable } from '@vee-validate/shared';
import { ValidationRuleFunction } from './types';

const RULES: Record<string, ValidationRuleFunction> = {};

export class RuleContainer {
  public static extend(name: string, validator: ValidationRuleFunction) {
    RULES[name] = validator;
  }

  public static getRuleDefinition(ruleName: string) {
    return RULES[ruleName];
  }
}

/**
 * Adds a custom validator to the list of validation rules.
 */
export function defineRule(name: string, validator: ValidationRuleFunction) {
  // makes sure new rules are properly formatted.
  guardExtend(name, validator);

  RuleContainer.extend(name, validator);
}

/**
 * Guards from extension violations.
 */
function guardExtend(name: string, validator: ValidationRuleFunction) {
  if (isCallable(validator)) {
    return;
  }

  throw new Error(`Extension Error: The validator '${name}' must be a function.`);
}
