import { isNullOrUndefined } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { length }: any): boolean => {
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
