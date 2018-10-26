import isEmail from 'validator/lib/isEmail';

const validate = (value, options = {}) => {
  if (options.multiple) {
    value = value.split(',').map(emailStr => emailStr.trim());
  }

  if (Array.isArray(value)) {
    return value.every(val => isEmail(String(val), options));
  }

  return isEmail(String(value), options);
};

export {
  validate
};

export default {
  validate
};
