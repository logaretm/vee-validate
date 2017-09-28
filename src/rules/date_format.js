import { parseDate as parse } from '../core/utils/date';

export default (value, [format]) => {
  return !!parse(value, format);
};
