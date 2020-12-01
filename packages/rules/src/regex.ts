import { getSingleParam } from './utils';

const regexValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  let regex = getSingleParam(params, 'regex');
  if (typeof regex === 'string') {
    regex = new RegExp(regex);
  }

  if (Array.isArray(value)) {
    return value.every(val => regexValidator(val, { regex: regex }));
  }

  return regex.test(String(value));
};

export default regexValidator;
