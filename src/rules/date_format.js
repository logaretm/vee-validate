import { parse, isValid } from 'date-fns';

export default (value, [format]) => {
  const date = parse(value, format, new Date());
  return isValid(date);
};
