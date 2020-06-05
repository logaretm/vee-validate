import { isEmptyArray, isNullOrUndefined } from '@vee-validate/shared';

const requiredValidator = (value: any) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
    return false;
  }

  return !!String(value).trim().length;
};

export default requiredValidator;
