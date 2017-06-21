import { parse, isValid, isAfter, isBefore, isEqual } from 'date-fns';

export default (value, params) => {
  let min;
  let max;
  let format;
  let inclusivity = '()';

  if (params.length > 3) {
    [min, max, inclusivity, format] = params;
  } else {
    [min, max, format] = params;
  }

  const minDate = parse(min, format, new Date());
  const maxDate = parse(max, format, new Date());
  const dateVal = parse(value, format, new Date());

  if (! (isValid(minDate) && isValid(maxDate) && isValid(dateVal))) {
    return false;
  }

  if (inclusivity === '()') {
    return isAfter(dateVal, minDate) && isBefore(dateVal, maxDate);
  }

  if (inclusivity === '(]') {
    return isAfter(dateVal, minDate) && (isEqual(dateVal, maxDate) || isBefore(dateVal, maxDate));
  }

  if (inclusivity === '[)') {
    return isBefore(dateVal, maxDate) && (isEqual(dateVal, minDate) || isAfter(dateVal, minDate));
  }

  return isEqual(dateVal, maxDate) || isEqual(dateVal, minDate) ||
        (isBefore(dateVal, maxDate) && isAfter(dateVal, minDate));
};
