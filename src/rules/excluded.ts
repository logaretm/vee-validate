import { validate as includes } from './included';

const validate = (value: any, args: any[]) => {
  return !includes(value, args);
};

export {
  validate
};

export default {
  validate
};
