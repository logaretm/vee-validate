import { FormSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Validate multiple fields
 */
export function useValidateForm() {
  const form = injectWithSelf(FormSymbol);
  if (!form) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return function validateField() {
    if (!form) {
      return Promise.resolve(undefined);
    }

    return form.validate();
  };
}
