import { ValidationRuleFunction, toArray } from '@vee-validate/shared';

const oneOfValidator: ValidationRuleFunction = (value, options) => {
  if (Array.isArray(value)) {
    return value.every(val => oneOfValidator(val, options));
  }

  return toArray(options as any[]).some(item => {
    // eslint-disable-next-line
    return item == value;
  });
};

export default oneOfValidator;
