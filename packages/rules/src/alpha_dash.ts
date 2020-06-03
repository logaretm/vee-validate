import { alphaDash, getLocale } from './alpha_helper';
import { ValidationRuleFunction } from '@vee-validate/shared';

const alphaDashValidator: ValidationRuleFunction = (value: any, params): boolean => {
  const locale = getLocale(params);
  if (Array.isArray(value)) {
    return value.every(val => alphaDashValidator(val, { locale }));
  }

  // Match at least one locale.
  if (!locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value));
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
};

export default alphaDashValidator;
