import { toArray } from '../utils';

/**
 * @param {Array} value 
 * @param {Number?} max 
 */
const compare = (value, length, max) => {
  if (max === undefined) {
    return value.length === length;
  }

  // cast to number.
  max = Number(max);

  return value.length >= length && value.length <= max;
};

export default (value, [length, max = undefined]) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (!value.length) {
    value = toArray(value);
  }

  return compare(value, length, max);
};
