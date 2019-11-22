import { RuleParamSchema, StringOrNumber } from '../types';

const validate = (value: StringOrNumber | StringOrNumber[], { regex }: Record<string, any>): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { regex: regex }));
  }

  return regex.test(String(value));
};

const params: RuleParamSchema[] = [
  {
    name: 'regex',
    cast(value) {
      if (typeof value === 'string') {
        return new RegExp(value);
      }

      return value;
    }
  }
];

export { validate, params };

export default {
  validate,
  params
};
