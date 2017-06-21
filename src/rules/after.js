import { parse, isValid, isAfter, isEqual } from 'date-fns';

export default (value, [targetField, inclusion, format]) => {
  const field = document.querySelector(`input[name='${targetField}']`);
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  const dateValue = parse(value, format, new Date());
  const otherValue = parse(field ? field.value : targetField, format, new Date());

  // if either is not valid.
  if (! isValid(dateValue) || ! isValid(otherValue)) {
    return false;
  }

  return isAfter(dateValue, otherValue) || (inclusion && isEqual(dateValue, otherValue));
};
