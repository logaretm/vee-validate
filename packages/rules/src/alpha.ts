import { alpha, getLocale } from './alpha_helper';
import { ValidationRuleFunction } from '@vee-validate/shared';

const alphaValidator: ValidationRuleFunction = (value: any, params): boolean => {
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
