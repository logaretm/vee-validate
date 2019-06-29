import { isEmptyArray } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { target, values }: any) => {
  let required = values.includes(String(target).trim());

  if (!required) {
    return {
      valid: true,
      required
    };
  }

  let invalid = isEmptyArray(value) || [false, null, undefined].includes(value);

  invalid = invalid || !String(value).trim().length;

  return {
    valid: !invalid,
    required
  };
};

const params: RuleParamSchema[] = [
  {
    name: 'target',
    isTarget: true
  },
  {
    name: 'values'
  }
];

export const computesRequired = true;

export { validate, params };

export default {
  validate,
  params,
  computesRequired
};
