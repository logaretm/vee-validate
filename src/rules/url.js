import isURL from 'validator/lib/isURL';
import { isNullOrUndefined } from '../core/utils';

export default (value, [requireProtocol = false] = []) => {
  const options = { require_protocol: !!requireProtocol, allow_underscores: true };
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => isURL(val, options));
  }

  return isURL(value, options);
};
