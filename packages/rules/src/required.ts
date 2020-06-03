import { isEmptyArray, isNullOrUndefined, ValidationRuleFunction } from '@vee-validate/shared';

const requiredValidator: ValidationRuleFunction = (value: any) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
    return false;
  }

  return !!String(value).trim().length;
};

export default requiredValidator;
