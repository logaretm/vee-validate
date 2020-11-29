import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If the form is submitting or not
 */
export function useIsSubmitting() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.isSubmitting.value;
  });
}
