import { computed } from 'vue';
import { FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * If the form is submitting or not
 */
export function useIsSubmitting() {
  const form = injectWithSelf(FormContextKey);
  if (!form) {
    if (__DEV__) {
      warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
  }

  return computed(() => {
    return form?.isSubmitting.value ?? false;
  });
}
