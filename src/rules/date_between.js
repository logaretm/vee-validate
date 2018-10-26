import { isAfter, isBefore, isEqual } from 'date-fns';
import { parseDate as parse } from '../utils/date';

const validate = (value, { min, max, inclusivity = '()', format } = {}) => {
  if (typeof format === 'undefined') {
    format = inclusivity;
    inclusivity = '()';
  }

  const minDate = parse(String(min), format);
  const maxDate = parse(String(max), format);
  const dateVal = parse(String(value), format);

  if (!minDate || !maxDate || !dateVal) {
    return false;
  }

  if (inclusivity === '()') {
    return isAfter(dateVal, minDate) && isBefore(dateVal, maxDate);
  }

  if (inclusivity === '(]') {
    return isAfter(dateVal, minDate) && (isEqual(dateVal, maxDate) || isBefore(dateVal, maxDate));
  }

  if (inclusivity === '[)') {
    return isBefore(dateVal, maxDate) && (isEqual(dateVal, minDate) || isAfter(dateVal, minDate));
  }

  return isEqual(dateVal, maxDate) || isEqual(dateVal, minDate) ||
    (isBefore(dateVal, maxDate) && isAfter(dateVal, minDate));
};

const options = {
  isDate: true
};

const paramNames = ['min', 'max', 'inclusivity', 'format'];

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
