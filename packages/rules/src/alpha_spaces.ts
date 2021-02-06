import { alphaSpaces, getLocale } from './alpha_helper';

const alphaSpacesValidator = (value: unknown, params?: [string] | { locale?: string }): boolean => {
  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaSpacesValidator(val, { locale }));
  }

  const valueAsString = String(value);

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(valueAsString));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(valueAsString);
};

export default alphaSpacesValidator;
