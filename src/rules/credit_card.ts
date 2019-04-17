import { isCreditCard } from 'validator';

const validate = (value) => isCreditCard(String(value));

export {
  validate
};

export default {
  validate
};
