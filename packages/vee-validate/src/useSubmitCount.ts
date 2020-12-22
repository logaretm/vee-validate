import { computed } from 'vue';
import { FormContextSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * The number of form's submission count
 */
export function useSubmitCount() {
  const form = injectWithSelf(FormContextSymbol);
  if (!form) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return computed(() => {
    return form?.submitCount.value ?? 0;
  });
}
