import { ValidationRuleFunction, RuleParamSchema } from '../types';

const validate: ValidationRuleFunction = (value, { min, max }: any = {}) => {
  if (Array.isArray(value)) {
    return value.every(val => !!validate(val, { min, max }));
  }

  return Number(min) <= value && Number(max) >= value;
};

const params: RuleParamSchema[] = [
  {
    name: 'min'
  },
  {
    name: 'max'
  }
];

export { validate, params };

export default {
  validate,
  params
};
