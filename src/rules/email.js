import isEmail from 'validator/lib/isEmail';

export default (value) => isEmail(String(value));
