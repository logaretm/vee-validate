import { parseDate as parse } from '../core/utils/date';

const validate = (value, [format]) => {
  return !!parse(value, format);
};

const options = {
  isDate: true
};

export {
  validate,
  options
};

export default {
  validate,
  options
};
