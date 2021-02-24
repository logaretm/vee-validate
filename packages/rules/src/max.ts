import { getSingleParam, isEmpty } from './utils';

const maxLengthValidator = (value: unknown, params: [string | number] | { length: string | number }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  const length = getSingleParam(params, 'length');
  if (Array.isArray(value)) {
    return value.every(val => maxLengthValidator(val, { length }));
  }

  return String(value).length <= Number(length);
};

export default maxLengthValidator;
