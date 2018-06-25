const validate = (value, [max]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) <= max;
};

export {
  validate
};

export default {
  validate
};
