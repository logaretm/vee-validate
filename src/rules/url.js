import isURL from 'validator/lib/isURL';
import { assign, isNullOrUndefined } from '../utils';

const validate = (value, options = {}) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  const validatorOptions = assign({}, options);

  if (Array.isArray(value)) {
    return value.every(val => isURL(val, validatorOptions));
  }

  return isURL(value, validatorOptions);
};

export {
  validate
};

export default {
  validate
};
