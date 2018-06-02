import isEmail from 'validator/lib/isEmail';

const validate = (value, [multiple = false] = []) => {
  if (multiple) {
    value = value.split(',').map(emailStr => emailStr.trim());
  }

  if (Array.isArray(value)) {
    return value.every(val => isEmail(String(val)));
  }

  return isEmail(String(value));
};

export default validate;
