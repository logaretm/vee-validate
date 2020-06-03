import { isNullOrUndefined, toArray, ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const lengthValidator: ValidationRuleFunction = (value: any, params) => {
  // Normalize the length value
  const length = getSingleParam(params, 'length');
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return value.length === Number(length);
};

export default lengthValidator;
