import { isNullOrUndefined } from '../../shared';
import { getSingleParam, isEmpty } from './utils';

const minValidator = (value: unknown, params: [string | number] | { length: string | number }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

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
