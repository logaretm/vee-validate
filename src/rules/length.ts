import { isNullOrUndefined, toArray } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: string | number | string[], { length }: Record<string, any>) => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'string') {
    value = toArray(value);
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return value.length === length;
};

const params: RuleParamSchema[] = [
  {
    name: 'length',
    cast: value => Number(value)
  }
];

export { validate, params };

export default {
  validate,
  params
};
