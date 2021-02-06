import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const minValidator = (value: string | string[], params: [string | number] | { length: string | number }): boolean => {
  const length = getSingleParam(params, 'length');

  if (isNullOrUndefined(value)) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.every(val => minValidator(val, { length }));
  }

  return String(value).length >= Number(length);
};

export default minValidator;
