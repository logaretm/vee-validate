import { FormErrorsSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * Gives access to all form errors
 */
export function useFormErrors() {
  const errors = injectWithSelf(FormErrorsSymbol);

  return errors;
}
