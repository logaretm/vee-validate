import { ValidationRuleFunction, RuleParamSchema } from '../types';

const validate: ValidationRuleFunction = (value, { target }: any) => String(value) === String(target);

const params: RuleParamSchema[] = [
  {
    name: 'target',
    isTarget: true
  }
];

export { validate, params };

export default {
  validate,
  params
};
