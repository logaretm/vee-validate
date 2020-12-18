import { computed } from 'vue';
import { FormErrorsSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Gives access to all form errors
 */
export function useFormErrors() {
  const errors = injectWithSelf(FormErrorsSymbol);
  if (!errors) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return errors || computed(() => ({}));
}
