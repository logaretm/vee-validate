import { isEmpty } from './utils';

const integerValidator = (value: unknown) => {
  if (isEmpty(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(val => /^-?[0-9]+$/.test(String(val)));
  }

  return /^-?[0-9]+$/.test(String(value));
};

export default integerValidator;
