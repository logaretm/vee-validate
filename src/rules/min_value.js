import { isNullOrUndefined } from '../utils';

const validate = (value, [min]) => {
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => validate(val, [min]));
  }

  return Number(value) >= min;
};

export {
  validate
};

export default {
  validate
};
