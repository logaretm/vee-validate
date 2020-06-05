import oneOf from './one_of';

const excludedValidator = (value: any, args: any[]) => {
  return !oneOf(value, args);
};

export default excludedValidator;
