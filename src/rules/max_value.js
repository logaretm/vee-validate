const validate = (value, [max]) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => validate(val, [max]));
  }

  return Number(value) <= max;
};

export {
  validate
};

export default {
  validate
};
