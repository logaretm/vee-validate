import { parseDate as parse } from '../core/utils';

export default (value, [format]) => {
  return !!parse(value, format);
};
