import { isCallable } from '@vee-validate/shared';

const RULES: Record<string, ValidationRuleFunction> = {};

/**
 * Adds a custom validator to the list of validation rules.
 */
export function defineRule(id: string, validator: ValidationRuleFunction) {
  // makes sure new rules are properly formatted.
  guardExtend(id, validator);

  RULES[id] = validator;
}

/**
 * Gets an already defined rule
 */
export function resolveRule(id: string) {
  return RULES[id];
}

/**
 * Guards from extension violations.
 */
function guardExtend(id: string, validator: ValidationRuleFunction) {
  if (isCallable(validator)) {
    return;
  }

  throw new Error(`Extension Error: The validator '${id}' must be a function.`);
}
