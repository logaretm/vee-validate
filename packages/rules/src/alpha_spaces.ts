import { alphaSpaces } from './alpha_helper';

const validate = (value: any, { locale = '' }: Record<string, any> = {}): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

const params = ['name'];

export { validate, params };

export default {
  validate,
  params,
};
