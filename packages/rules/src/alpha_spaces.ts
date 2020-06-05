import { alphaSpaces, getLocale } from './alpha_helper';

const alphaSpacesValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaSpacesValidator(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

export default alphaSpacesValidator;
