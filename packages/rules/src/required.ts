import { isEmptyArray, isNullOrUndefined } from '@vee-validate/shared';

const validate = (value: any, { allowFalse }: Record<string, any> = { allowFalse: true }) => {
  if (isNullOrUndefined(value) || isEmptyArray(value)) {
    return false;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  if (value === false && !allowFalse) {
    return false;
  }

  return !!String(value).trim().length;
};

const params = ['allowFalse'];

export { validate, params };

export default {
  validate,
  params,
};
