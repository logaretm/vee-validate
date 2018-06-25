import isIP from 'validator/lib/isIP';
import { isNullOrUndefined } from '../core/utils';

const validate = (value, [version = 4] = []) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => isIP(val, version));
  }

  return isIP(value, version);
};

export {
  validate
};

export default {
  validate
};
