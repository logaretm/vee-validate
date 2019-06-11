import { ValidationRule } from './types';
import RuleContainer from './core/ruleContainer';
import { isCallable } from './utils';

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
