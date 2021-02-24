import { alphaDash, getLocale } from './alpha_helper';
import { isEmpty } from './utils';

const alphaDashValidator = (value: unknown, params: [string | undefined] | { locale?: string }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaDashValidator(val, { locale }));
  }

  const valueAsString = String(value);
  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(valueAsString));
  }

  return (alphaDash[locale] || alphaDash.en).test(valueAsString);
};

export default alphaDashValidator;
