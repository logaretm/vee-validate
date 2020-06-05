import { alphanumeric, getLocale } from './alpha_helper';

const alphaNumValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaNumValidator(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

export default alphaNumValidator;
