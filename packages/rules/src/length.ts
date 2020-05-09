import { isNullOrUndefined, toArray } from '@vee-validate/shared';

const validate = (value: any, { length }: Record<string, any>) => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return value.length === Number(length);
};

const params = ['length'];

export { validate, params };

export default {
  validate,
  params,
};
