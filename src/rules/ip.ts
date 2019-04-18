import { isIP } from 'validator';
import { isNullOrUndefined } from '../utils';

const validate = (value: any, { version = 4 } = {}) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => isIP(val, version));
  }

  return isIP(value, version);
};

const paramNames = ['version'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
