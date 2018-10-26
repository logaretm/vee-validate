import { validate as includes } from './included';

const validate = (...args) => {
  return !includes(...args);
};

export {
  validate
};

export default {
  validate
};
