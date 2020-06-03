import { isNullOrUndefined, ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const minValueValidator: ValidationRuleFunction = (value: any, params): boolean => {
  const min = getSingleParam(params, 'min');
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => minValueValidator(val, { min }));
  }

  return Number(value) >= Number(min);
};

export default minValueValidator;
