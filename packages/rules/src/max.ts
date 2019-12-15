import { RuleParamSchema, isNullOrUndefined } from '@vee-validate/shared';

const validate = (value: any, { length }: Record<string, any>): boolean => {
  if (isNullOrUndefined(value)) {
    return length >= 0;
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { length }));
  }

  return String(value).length <= length;
};

const params: RuleParamSchema[] = [
  {
    name: 'length',
    cast(value) {
      return Number(value);
    }
  }
];

export { validate, params };

export default {
  validate,
  params
};
