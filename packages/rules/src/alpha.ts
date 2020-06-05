import { alpha, getLocale } from './alpha_helper';

const alphaValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaValidator(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alpha).some(loc => alpha[loc].test(value));
  }

  return (alpha[locale] || alpha.en).test(value);
};

export default alphaValidator;
