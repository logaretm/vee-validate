import { ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const regexValidator: ValidationRuleFunction = (value: any, params): boolean => {
  let regex = getSingleParam(params, 'regex');
  if (typeof regex === 'string') {
    regex = new RegExp(value);
  }

  if (Array.isArray(value)) {
    return value.every(val => regexValidator(val, { regex: regex }));
  }

  return regex.test(String(value));
};

export default regexValidator;
