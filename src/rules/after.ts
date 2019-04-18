import { isValidDate } from '../utils';

interface AfterValidatorParams {
  targetValue?: any;
  inclusion?: boolean;
}

const afterValidator = (value: any, { targetValue = null, inclusion = false }: AfterValidatorParams = {}) => {
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
