import { StringOrNumber } from '../types';

const validate = (value: StringOrNumber | StringOrNumber[]) => {
  if (Array.isArray(value)) {
    return value.every(val => /^-?[0-9]+$/.test(String(val)));
  }

  return /^-?[0-9]+$/.test(String(value));
};

export { validate };

export default {
  validate
};
