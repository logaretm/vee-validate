import { alphaSpaces } from './alpha_helper';

export default (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};
