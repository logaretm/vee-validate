const validate = (value, { decimals = '*', separator = '.' } = {}) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, { decimals, separator }));
  }

  if (value === null || value === undefined || value === '') {
    return false;
  }

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?$`);

  if (! regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  // eslint-disable-next-line
    return parsedValue === parsedValue;
};

const paramNames = ['decimals', 'separator'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
