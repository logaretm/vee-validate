import { isAfter, isBefore, isEqual } from 'date-fns';
import { parseDate as parse } from '../core/utils/date';

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

  const minDate = parse(String(min), format);
  const maxDate = parse(String(max), format);
  const dateVal = parse(String(value), format);

  if (!minDate || !maxDate || !dateVal) {
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
