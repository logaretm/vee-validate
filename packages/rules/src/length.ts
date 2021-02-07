import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const lengthValidator = (value: unknown, params: [number | string] | { length: string | number }) => {
  // Normalize the length value
  const length = getSingleParam(params, 'length');
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!(value as ArrayLike<unknown>).length) {
    value = Array.from(value as ArrayLike<unknown>);
  }

  return (value as ArrayLike<unknown>).length === Number(length);
};

export default lengthValidator;
