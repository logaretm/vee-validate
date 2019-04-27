import { isValidDate } from '../utils';
import { ValidationRuleFunction, RuleParamSchema } from '../types';

const validate: ValidationRuleFunction = (value, { target, allowEqual }: any) => {
  // if either is not valid.
  if (!isValidDate(value) || !isValidDate(target)) {
    return false;
  }

  if (allowEqual) {
    return value.getTime() <= target.getTime();
  }

  return value.getTime() < target.getTime();
};

const params: RuleParamSchema[] = [
  {
    name: 'target',
    isTarget: true
  },
  {
    name: 'allowEqual',
    default: false
  }
];

export { validate, params };

export default {
  validate,
  params
};
