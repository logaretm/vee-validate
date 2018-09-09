import isURL from 'validator/lib/isURL';
import { isNullOrUndefined } from '../core/utils';

const validate = (value, options = {}) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => isURL(val, options));
  }

  return isURL(value, options);
};

export {
  validate
};

export default {
  validate
};
