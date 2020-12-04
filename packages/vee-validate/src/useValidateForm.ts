import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * Validate multiple fields
 */
export function useValidateForm() {
  const form = injectWithSelf(FormSymbol);

  return function validateField() {
    return form?.validate();
  };
}
