const validate = (value, options) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, options));
  }

  // eslint-disable-next-line
  return !! options.filter(option => option == value).length;
};

export default validate;
