import { isBefore, isEqual } from 'date-fns';
import { parseDate as parse } from '../utils/date';

const validate = (value, { targetValue, inclusion = false, format } = {}) => {
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

  return isBefore(value, targetValue) || (inclusion && isEqual(value, targetValue));
};

const options = {
  hasTarget: true,
  isDate: true
};

const paramNames = ['targetValue', 'inclusion', 'format'];

export {
  validate,
  options,
  paramNames
};

export default {
  validate,
  options,
  paramNames
};
