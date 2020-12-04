import { FormSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Validate multiple fields
 */
export function useValidateForm() {
  const form = injectWithSelf(FormSymbol);

  return function validateField() {
    if (!form) {
      warn('No form context was detected, undefined is returned');
      return Promise.resolve(undefined);
    }

    return form.validate();
  };
}
