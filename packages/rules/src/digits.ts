import { getSingleParam, isEmpty } from './utils';

const digitsValidator = (value: unknown, params: [string | number] | { length: string | number }): boolean => {
  if (isEmpty(value)) {
    return true;
  }
  const length = getSingleParam(params, 'length');
  if (Array.isArray(value)) {
    return value.every(val => digitsValidator(val, { length }));
  }
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

export default digitsValidator;
