import { isIP, isFQDN } from 'validator';
import { isNullOrUndefined } from '../utils';

const validate = (value: any) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => (isIP(val) || isFQDN(val)));
  }

  return isIP(value) || isFQDN(value);
};

export {
  validate
};

export default {
  validate
};
