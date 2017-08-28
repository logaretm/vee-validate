import { parseDate as parse } from '../utils';

export default (value, [format]) => {
  return !!parse(value, format);
};
