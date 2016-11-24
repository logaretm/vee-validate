import isCreditCard from 'validator/lib/isCreditCard';

export default (value) => isCreditCard(String(value));
