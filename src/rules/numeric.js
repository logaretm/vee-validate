import isNumeric from 'validator/lib/isNumeric';

export default (value) => isNumeric(String(value));
