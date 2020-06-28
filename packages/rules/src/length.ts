import { isNullOrUndefined } from '../../shared';
import { getSingleParam } from './utils';

const lengthValidator = (value: any, params?: any[] | Record<string, any>) => {
  // Normalize the length value
  const length = getSingleParam(params, 'length');
  if (isNullOrUndefined(value)) {
    return false;
  }

  if (typeof value === 'number') {
    value = String(value);
  }

  if (!value.length) {
    value = Array.from(value);
  }

  return value.length === Number(length);
};

export default lengthValidator;
