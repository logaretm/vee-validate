import { isAfter, isEqual } from 'date-fns';
import { parseDate as parse } from '../core/utils/date';

export default (value, [otherValue, inclusion, format]) => {
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
