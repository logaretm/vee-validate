import { isNullOrUndefined } from '../utils';
import { RuleParamSchema, StringOrNumber } from '../types';

const validate = (value: StringOrNumber | StringOrNumber[], { length }: Record<string, any>): boolean => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { length }));
  }

  return String(value).length >= length;
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
