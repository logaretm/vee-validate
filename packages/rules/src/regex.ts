import { getSingleParam } from './utils';

const regexValidator = (value: unknown, params: [string | RegExp] | { regex: RegExp | string }): boolean => {
  let regex = getSingleParam(params, 'regex');
  if (typeof regex === 'string') {
    regex = new RegExp(regex);
  }

  if (Array.isArray(value)) {
    return value.every(val => regexValidator(val, { regex }));
  }

  return regex.test(String(value));
};

export default regexValidator;
