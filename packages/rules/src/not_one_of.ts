import oneOf from './one_of';

const excludedValidator = (value: unknown, list: unknown[]) => {
  return !oneOf(value, list);
};

export default excludedValidator;
