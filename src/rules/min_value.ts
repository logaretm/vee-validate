import { isNullOrUndefined } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { min }: any): boolean => {
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => validate(val, { min }));
  }

  return Number(value) >= min;
};

const params: RuleParamSchema[] = [
  {
    name: 'min',
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
