import { computed, ComputedRef } from 'vue';
import { FormErrorsSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Gives access to all form errors
 */
export function useFormErrors<TValues extends Record<string, unknown> = Record<string, unknown>>() {
  const errors = injectWithSelf(FormErrorsSymbol);
  if (!errors) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return (errors as ComputedRef<Partial<Record<keyof TValues, string | undefined>>>) || computed(() => ({}));
}
