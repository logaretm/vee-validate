import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const maxValueValidator = (
  value: number | string | (number | string)[],
  params: [string | number] | { max: string | number }
): boolean => {
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
