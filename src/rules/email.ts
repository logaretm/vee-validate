import { assign } from '../utils';

const validate = (value: string | string[], { multiple = false } = {}) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (multiple && !Array.isArray(value)) {
    value = String(value).split(',').map(emailStr => emailStr.trim());
  }

  if (Array.isArray(value)) {
    return value.every(val => re.test(String(val)));
  }

  return re.test(String(value));
};

export {
  validate
};

export default {
  validate
};
