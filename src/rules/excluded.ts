import { validate as includes } from './included';

const validate = (value, args) => {
  return !includes(value, args);
};

export {
  validate
};

export default {
  validate
};
