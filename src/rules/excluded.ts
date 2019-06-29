import { validate as includes } from './oneOf';

const validate = (value: any, args: any[]) => {
  return !includes(value, args);
};

export { validate };

export default {
  validate
};
