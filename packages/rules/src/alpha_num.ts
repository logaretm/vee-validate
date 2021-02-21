import { alphanumeric, getLocale } from './alpha_helper';
import { isEmpty } from './utils';

const alphaNumValidator = (value: unknown, params: [string | undefined] | { locale?: string }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaNumValidator(val, { locale }));
  }

  const valueAsString = String(value);
  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(valueAsString));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(valueAsString);
};

export default alphaNumValidator;
