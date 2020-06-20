import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const minValueValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
  const min = getSingleParam(params, 'min');
  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => minValueValidator(val, { min }));
  }

  return Number(value) >= Number(min);
};

export default minValueValidator;
