import { isNullOrUndefined } from '@vee-validate/shared';

const validate = (value: any, { min }: Record<string, any>): boolean => {
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => validate(val, { min }));
  }

  return Number(value) >= Number(min);
};

const params = ['min'];

export { validate, params };

export default {
  validate,
  params,
};
