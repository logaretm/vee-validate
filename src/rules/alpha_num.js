import { alphanumeric } from './alpha_helper';

const validate = (value, { locale } = {}) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

const paramNames = ['locale'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
