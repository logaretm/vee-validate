import { parseDate as parse } from '../utils/date';

const validate = (value, { format }) => {
  return !!parse(value, format);
};

const options = {
  isDate: true
};

const paramNames = ['format'];

export {
  validate,
  options,
  paramNames
};

export default {
  validate,
  options,
  paramNames
};
