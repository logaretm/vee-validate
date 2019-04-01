import { isValidDate } from '../utils';

const afterValidator = (value, { targetValue, inclusion = false } = {}) => {
  // if either is not valid.
  if (!isValidDate(value) || !isValidDate(targetValue)) {
    return false;
  }

  if (inclusion) {
    return value.getTime() >= targetValue.getTime();
  }

  return value.getTime() > targetValue.getTime();
};

const options = {
  hasTarget: true,
  isDate: true
};

// required to convert from a list of array values to an object.
const paramNames = ['targetValue', 'inclusion'];

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
