import { isEmptyArray, isNullOrUndefined } from '../utils';

const validate = (value: any, [invalidateFalse = false] = []) => {
  const result = {
    valid: false,
    data: {
      required: true
    }
  };

  if (isNullOrUndefined(value) || isEmptyArray(value)) {
    return result;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && invalidateFalse) {
    return result;
  }

  result.valid = !!String(value).trim().length;

  return result;
};

const options = {
  computesRequired: true
};

export { validate, options };

export default {
  validate,
  options
};
