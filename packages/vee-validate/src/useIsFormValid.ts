import { computed } from 'vue';
import { FormContextSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * If the form has been validated and is valid
 */
export function useIsFormValid() {
  const form = injectWithSelf(FormContextSymbol);
  if (!form) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return computed(() => {
    return form?.meta.value.valid ?? false;
  });
}
