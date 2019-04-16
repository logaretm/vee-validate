import isEmail from 'validator/lib/isEmail';
import { assign } from '../utils';

const validate = (value, { multiple = false, ...options } = {}) => {
  if (multiple && !Array.isArray(value)) {
    value = String(value).split(',').map(emailStr => emailStr.trim());
  }

  const validatorOptions = assign({}, options);

  if (Array.isArray(value)) {
    return value.every(val => isEmail(String(val), validatorOptions));
  }

  return isEmail(String(value), validatorOptions);
};

export {
  validate
};

export default {
  validate
};
