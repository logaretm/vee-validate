import { isNullOrUndefined } from '@vee-validate/shared';

const validate = (value: any, { length }: Record<string, any>): boolean => {
  if (isNullOrUndefined(value)) {
    return length >= 0;
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { length }));
  }

  return String(value).length <= Number(length);
};

const params = ['length'];

export { validate, params };

export default {
  validate,
  params,
};
