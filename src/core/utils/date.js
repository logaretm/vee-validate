import { parse, isValid, format as formatDate } from 'date-fns';

/**
 * Custom parse behavior on top of date-fns parse function.
 * @param {String} date
 * @param {String} format
 * @return {Date|null}
 */
export const parseDate = (date, format) => {
  const parsed = parse(date, format, new Date());

  // if date is not valid or the formatted output after parsing does not match
  // the string value passed in (avoids overflows)
  if (!isValid(parsed) || formatDate(parsed, format) !== date) {
    return null;
  }

  return parsed;
};
