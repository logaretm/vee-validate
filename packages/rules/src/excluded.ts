import { validate as includes } from './oneOf';
import { ValidationRuleFunction } from '@vee-validate/shared';

const validate: ValidationRuleFunction = (value, args) => {
  return !includes(value, args);
};

export { validate };

export default {
  validate
};
