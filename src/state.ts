import Validator from "./core/validator";

let VALIDATOR: Validator;

export const getValidator = () => {
  return VALIDATOR;
};

export const setValidator = (value: Validator) => {
  VALIDATOR = value;

  return value;
};
