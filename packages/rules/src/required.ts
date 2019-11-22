import { isEmptyArray, isNullOrUndefined } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { allowFalse }: Record<string, any> = { allowFalse: true }) => {
  const result = {
    valid: false,
    required: true
  };

  if (isNullOrUndefined(value) || isEmptyArray(value)) {
    return result;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && !allowFalse) {
    return result;
  }

  result.valid = !!String(value).trim().length;

  return result;
};

export const computesRequired = true;

const params: RuleParamSchema[] = [
  {
    name: 'allowFalse',
    default: true
  }
];

export { validate, params };

export default {
  validate,
  params,
  computesRequired
};
