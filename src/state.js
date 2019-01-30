
let VALIDATOR = null;

export const getValidator = () => {
  return VALIDATOR;
};

export const setValidator = value => {
  VALIDATOR = value;

  return value;
};
