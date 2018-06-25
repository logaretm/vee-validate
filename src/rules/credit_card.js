import isCreditCard from 'validator/lib/isCreditCard';

const validate = (value) => isCreditCard(String(value));

export {
  validate
};

export default {
  validate
};
