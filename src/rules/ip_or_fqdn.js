import isIP from 'validator/lib/isIP';
import isFQDN from 'validator/lib/isFQDN';
import { isNullOrUndefined } from '../utils';

const validate = (value) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => (isIP(val, '') || isFQDN(val)));
  }

  return isIP(value, '') || isFQDN(value);
};

export {
  validate
};

export default {
  validate
};
