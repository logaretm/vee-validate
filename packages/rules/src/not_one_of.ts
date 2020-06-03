import { ValidationRuleFunction } from '@vee-validate/shared';
import oneOf from './one_of';

const excludedValidator: ValidationRuleFunction = (value, args) => {
  return !oneOf(value, args);
};

export default excludedValidator;
