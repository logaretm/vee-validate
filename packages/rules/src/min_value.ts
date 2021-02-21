import { isNullOrUndefined } from '../../shared';
import { getSingleParam, isEmpty } from './utils';

const minValueValidator = (value: unknown, params: [string | number] | { min: string | number }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

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
