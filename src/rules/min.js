const validate = (value, [length]) => {
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= length;
};

export {
  validate
};

export default {
  validate
};
