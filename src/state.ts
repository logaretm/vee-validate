import Validator from "./core/validator";

let VALIDATOR: Validator = null;

export const getValidator = () => {
  return VALIDATOR;
};

export const setValidator = (value: Validator) => {
  VALIDATOR = value;

  return value;
};
