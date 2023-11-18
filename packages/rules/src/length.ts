import { getSingleParam, isEmpty } from './utils';

const lengthValidator = (value: unknown, params: [number | string] | { length: string | number }) => {
  if (isEmpty(value)) {
    return true;
  }

  // Normalize the length value
  const length = getSingleParam(params, 'length');

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!(value as ArrayLike<unknown>).length) {
    value = Array.from(value as ArrayLike<unknown>);
  }

  return (value as ArrayLike<unknown>).length === Number(length);
};

export default lengthValidator;
