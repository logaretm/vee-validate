import { ValidationRuleFunction } from "../types";

const validate: ValidationRuleFunction = (value, { min = null, max = null }: any = {}) => {
  if (Array.isArray(value)) {
    return value.every(val => !!validate(val, { min, max }));
  }

  return Number(min) <= value && Number(max) >= value;
};

const paramNames = ['min', 'max'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
