import { alpha } from './alpha_helper';

const validate = (value: any, { locale = '' }: Record<string, any> = {}): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alpha).some(loc => alpha[loc].test(value));
  }

  return (alpha[locale] || alpha.en).test(value);
};

const params = ['name'];

export { validate, params };

export default {
  validate,
  params,
};
