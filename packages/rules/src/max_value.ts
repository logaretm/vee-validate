import { isNullOrUndefined } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const maxValueValidator = (value: any, params?: any[] | Record<string, any>): boolean => {
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
