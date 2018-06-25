const validate = (value, [min]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) >= min;
};

export {
  validate
};

export default {
  validate
};
