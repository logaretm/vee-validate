import * as isCreditCard from 'validator/lib/isCreditCard';

const validate = (value: string) => isCreditCard(String(value));

export {
  validate
};

export default {
  validate
};
