import { RuleParamSchema } from '../types';

const validate = (value: any, { other }: Record<string, any>) => {
  return value !== other;
};

const params: RuleParamSchema[] = [
  {
    name: 'other'
  }
];

export { validate, params };

export default {
  validate,
  params
};
