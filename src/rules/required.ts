import { isEmptyArray, isNullOrUndefined } from '../utils';

const validate = (value, [invalidateFalse = false] = []) => {
  if (isNullOrUndefined(value) || isEmptyArray(value)) {
    return false;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && invalidateFalse) {
    return false;
  }

  return !!String(value).trim().length;
};

export {
  validate
};

export default {
  validate
};
