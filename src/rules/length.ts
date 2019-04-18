import { isNullOrUndefined, toArray } from '../utils';

const compare = (value: any[] | string, length: number, max: number) => {
  if (max === undefined) {
    return value.length === length;
  }

  // cast to number.
  max = Number(max);

  return value.length >= length && value.length <= max;
};

const validate = (value: any, [length, max = undefined]: any) => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  length = Number(length);
  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return compare(value, length, max);
};

export {
  validate
};

export default {
  validate
};
