/* eslint-disable no-useless-escape */
import { isEmpty } from './utils';

// https://github.com/colinhacks/zod/blob/master/src/types.ts#L567
const emailRE = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

const emailValidator = (value: unknown) => {
  if (isEmpty(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(val => emailRE.test(String(val)));
  }

  return emailRE.test(String(value));
};

export default emailValidator;
