const validate = (value, { targetValue }) => String(value) === String(targetValue);
const options = {
  hasTarget: true
};

const paramNames = ['targetValue'];

export {
  validate,
  options,
  paramNames
};

export default {
  validate,
  options,
  paramNames
};
