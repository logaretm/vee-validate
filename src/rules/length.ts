import { isNullOrUndefined, toArray } from '../utils';

/**
 * @param {Array|String} value
 * @param {Number} length
 * @param {Number} max
 */
const compare = (value, length, max) => {
  if (max === undefined) {
    return value.length === length;
  }

  // cast to number.
  max = Number(max);

  return value.length >= length && value.length <= max;
};

const validate = (value, [length, max = undefined]) => {
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
