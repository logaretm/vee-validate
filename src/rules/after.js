import { isAfter, isEqual } from 'date-fns';
import { parseDate as parse } from '../core/utils/date';

const afterValidator = (value, [otherValue, inclusion, format]) => {
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  value = parse(value, format);
  otherValue = parse(otherValue, format);

  // if either is not valid.
  if (!value || !otherValue) {
    return false;
  }

  return isAfter(value, otherValue) || (inclusion && isEqual(value, otherValue));
};

const options = {
  hasTarget: true,
  isDate: true
};

export {
  afterValidator as validate,
  options
};

export default {
  validate: afterValidator,
  options
};
