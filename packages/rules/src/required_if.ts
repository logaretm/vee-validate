import { isEmpty } from './utils';
import { isEmptyArray, isNullOrUndefined } from '../../shared';

const requiredIfValidator = (
  value: unknown,
  params: [unknown, ...unknown[]] | { target: unknown; values?: unknown[] },
) => {
  let target: unknown;
  let values: unknown[] | undefined;

  if (Array.isArray(params)) {
    target = params[0];
    values = params.slice(1);
  } else {
    target = params.target;
    values = params.values;
  }

  // Determine if the field should be required
  let isRequired: boolean;

  if (values && values.length) {
    // eslint-disable-next-line eqeqeq
    isRequired = values.some(val => val == target);
  } else {
    isRequired = !isNullOrUndefined(target) && !isEmptyArray(target) && !!String(target).trim().length;
  }

  if (!isRequired) {
    return true;
  }

  return !isEmpty(value);
};

export default requiredIfValidator;
