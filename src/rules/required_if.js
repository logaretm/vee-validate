import { isEmptyArray } from '../utils';

const validate = (value, [otherFieldVal, ...possibleVals] = []) => {
  let required = possibleVals.includes(String(otherFieldVal).trim());

  if (!required) {
    return {
      valid: true,
      data: {
        required
      }
    };
  }

  let invalid = (isEmptyArray(value) || [false, null, undefined].includes(value));

  invalid = invalid || !String(value).trim().length;

  return {
    valid: !invalid,
    data: {
      required
    }
  };
};

const options = {
  hasTarget: true,
  computesRequired: true
};

export {
  validate,
  options
};

export default {
  validate,
  options
};
