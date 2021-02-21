import { isNullOrUndefined } from '../../shared';
import { getSingleParam, isEmpty } from './utils';

const maxValueValidator = (value: unknown, params: [string | number] | { max: string | number }): boolean => {
  if (isEmpty(value)) {
    return true;
  }

  const max = getSingleParam(params, 'max');

  if (isNullOrUndefined(value) || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.every(val => maxValueValidator(val, { max }));
  }

  return Number(value) <= Number(max);
};

export default maxValueValidator;
