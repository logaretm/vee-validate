import { isValidDate } from '../utils';
import { ValidationRuleFunction } from '../types';

const validate: ValidationRuleFunction = (value, { targetValue = null, inclusion = false }: any = {}) => {
  // if either is not valid.
  if (!isValidDate(value) || !isValidDate(targetValue)) {
    return false;
  }

  if (inclusion) {
    return value.getTime() <= targetValue.getTime();
  }

  return value.getTime() < targetValue.getTime();
};

const options = {
  hasTarget: true,
  isDate: true
};

const paramNames = ['targetValue', 'inclusion'];

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
