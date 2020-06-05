import { isNullOrUndefined } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const maxLengthValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  const length = getSingleParam(params, 'length');

  if (isNullOrUndefined(value)) {
    return length >= 0;
  }

  if (Array.isArray(value)) {
    return value.every(val => maxLengthValidator(val, { length }));
  }

  return String(value).length <= Number(length);
};

export default maxLengthValidator;
