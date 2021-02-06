import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const lengthValidator = (value: ArrayLike<unknown>, params: [number | string] | { length: string | number }) => {
  // Normalize the length value
  const length = getSingleParam(params, 'length');
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = Array.from(value);
  }

  return value.length === Number(length);
};

export default lengthValidator;
