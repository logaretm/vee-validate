import { isNullOrUndefined, toArray } from '@vee-validate/shared';
import { RuleParamSchema } from '@vee-validate/shared';

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
