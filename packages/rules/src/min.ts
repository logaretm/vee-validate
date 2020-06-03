import { isNullOrUndefined, ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const minValidator: ValidationRuleFunction = (value: any, params): boolean => {
  const length = getSingleParam(params, 'length');

  if (isNullOrUndefined(value)) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.every(val => minValidator(val, { length }));
  }

  return String(value).length >= Number(length);
};

export default minValidator;
