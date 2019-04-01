import { isValidDate } from '../utils';

const validate = (value, { min, max, inclusivity = '()' } = {}) => {
  // if any is not valid.
  if (!isValidDate(value) || !isValidDate(min) || !isValidDate(max)) {
    return false;
  }

  const minDate = min.getTime();
  const maxDate = max.getTime();
  const dateVal = value.getTime();

  if (inclusivity === '()') {
    return dateVal > minDate && dateVal < maxDate;
  }

  if (inclusivity === '(]') {
    return dateVal > minDate && dateVal <= maxDate;
  }

  if (inclusivity === '[)') {
    return dateVal >= minDate && dateVal < maxDate;
  }

  return dateVal >= minDate && dateVal <= maxDate;
};

const options = {
  isDate: true
};

const paramNames = ['min', 'max', 'inclusivity'];

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
