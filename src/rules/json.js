import { isNullOrUndefined } from '../utils';

const isObject = (obj) => {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
};

const validate = (value, { type } = {}) => {
  if (isNullOrUndefined(value)) {
    value = '';
  }

  if (Array.isArray(value)) {
    return value.every(val => validate(val, [type]));
  }

  try {
    const jsonValue = JSON.parse(value);

    if (type === 'array_object') {
      if (Array.isArray(jsonValue)) {
        jsonValue.forEach(value => {
          if (!isObject(value)) throw new Error('is not Object');
        });

        return true;
      }

      return false;
    } else if (type === 'array') {
      return Array.isArray(jsonValue);
    } else if (type === 'object') {
      return isObject(jsonValue) && !Array.isArray(jsonValue);
    }
  } catch (e) {
    return false;
  }

  return true;
};

const paramNames = ['type'];

export {
  validate,
  paramNames
};

export default {
  validate,
  paramNames
};
