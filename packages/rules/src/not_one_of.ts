import oneOf from './one_of';
import { isEmpty } from './utils';

const excludedValidator = (value: unknown, list: unknown[]) => {
  if (isEmpty(value)) {
    return true;
  }

  return !oneOf(value, list);
};

export default excludedValidator;
