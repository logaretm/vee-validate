export default (value, [length, max = undefined]) => {
  if (value === undefined || value === null) {
    return false;
  }
  const compare = value => {
    if (max === undefined) {
      return value.length === length;
    }

    return value.length >= length && value.length <= max;
  };

  if (!value.length) {
    value = String(value);
  }

  return {
    valid: compare(value),
    data: {
      isArray: Array.isArray(value)
    }
  };
};
