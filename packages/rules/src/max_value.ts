import { ValidationRuleFunction, isNullOrUndefined } from '@vee-validate/shared';

const validate: ValidationRuleFunction = (value: any, { max }: Record<string, any>) => {
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => validate(val, { max }));
  }

  return Number(value) <= Number(max);
};

const params = ['max'];

export { validate, params };

export default {
  validate,
  params,
};
