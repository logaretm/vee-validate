import { isAfter, isEqual } from 'date-fns';
import { parseDate as parse } from '../utils/date';

const afterValidator = (value, { targetValue, inclusion = false, format } = {}) => {
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }

  value = parse(value, format);
  targetValue = parse(targetValue, format);

  // if either is not valid.
  if (!value || !targetValue) {
    return false;
  }

  return isAfter(value, targetValue) || (inclusion && isEqual(value, targetValue));
};

const options = {
  hasTarget: true,
  isDate: true
};

// required to convert from a list of array values to an object.
const paramNames = ['targetValue', 'inclusion', 'format'];

export {
  afterValidator as validate,
  options,
  paramNames
};

export default {
  validate: afterValidator,
  options,
  paramNames
};
