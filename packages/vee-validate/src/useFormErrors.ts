import { computed } from 'vue';
import { FormContextKey } from './symbols';
import { FormErrors } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * Gives access to all form errors
 */
export function useFormErrors<TValues extends Record<string, unknown> = Record<string, unknown>>() {
  const form = injectWithSelf(FormContextKey);
  if (!form) {
    if (__DEV__) {
      warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
  }

  return computed(() => {
    return (form?.errors.value || {}) as FormErrors<TValues>;
  });
}
