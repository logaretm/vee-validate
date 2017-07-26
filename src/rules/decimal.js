const validate = (value, params) => {
  const decimals = Array.isArray(params) ? (params[0] || '*') : '*';
  if (Array.isArray(value)) {
    return value.every(val => validate(val, params));
  }

  if (value === null || value === undefined || value === '') {
    return true;
  }

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

  if (! regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  // eslint-disable-next-line
    return parsedValue === parsedValue;
};

export default validate;
