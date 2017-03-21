import { alpha } from './alpha_helper';

export default (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alpha).some(loc => alpha[loc].test(value));
  }

  return (alpha[locale] || alpha.en).test(value);
};
