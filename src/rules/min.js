const validate = (value, [length]) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, [length]));
  }

  return String(value).length >= length;
};

export {
  validate
};

export default {
  validate
};
