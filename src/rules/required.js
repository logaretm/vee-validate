import { isEmptyArray } from '../utils';

const validate = (value, [invalidateFalse = false] = []) => {
  if (isEmptyArray(value)) {
    return false;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && invalidateFalse) {
    return false;
  }

  if (value === undefined || value === null) {
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
