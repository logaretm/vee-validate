import { isEmptyArray, isNullOrUndefined } from '../../shared';

const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) {
    return false;
  }

  return !!String(value).trim().length;
};

export default requiredValidator;
