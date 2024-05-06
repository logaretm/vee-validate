import { isEmpty } from './utils';

const oneOfValidator = (value: unknown, list: unknown[]): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(val => oneOfValidator(val, list));
  }

  return Array.from(list).some(item => {
    return item == value;
  });
};

export default oneOfValidator;
