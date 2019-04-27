import { isNullOrUndefined } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { decimals, separator }: any = {}): boolean => {
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  separator = isNullOrUndefined(separator) ? '.' : separator;
  decimals = isNullOrUndefined(decimals) ? '*' : decimals;

  if (Array.isArray(value)) {
    return value.every(val => validate(val, { decimals, separator }));
  }

  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?$`);

  if (!regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  return !isNaN(parsedValue);
};

const params: RuleParamSchema[] = [
  {
    name: 'decimals',
    default: '*'
  },
  {
    name: 'separator',
    default: '.'
  }
];

export { validate, params };

export default {
  validate,
  params
};
