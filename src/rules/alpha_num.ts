import { alphanumeric } from './alpha_helper';
import { RuleParamSchema } from '../types';

const validate = (value: string | string[], { locale = '' }: Record<string, any> = {}): boolean => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

const params: RuleParamSchema[] = [
  {
    name: 'locale'
  }
];

export { validate, params };

export default {
  validate,
  params
};
