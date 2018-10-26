import { alphaDash } from './alpha_helper';

const validate = (value, { locale } = {}) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value));
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
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
