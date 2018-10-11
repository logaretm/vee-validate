import { parse, isValid, format as formatDate } from 'date-fns';

// @flow

/**
 * Custom parse behavior on top of date-fns parse function.
 */
export function parseDate (date: string | Date, format: string): ?Date {
  if (typeof date !== 'string') {
    return isValid(date) ? date : null;
  }

  const parsed = parse(date, format, new Date());

  // if date is not valid or the formatted output after parsing does not match
  // the string value passed in (avoids overflows)
  if (!isValid(parsed) || formatDate(parsed, format) !== date) {
    return null;
  }

  return parsed;
};
