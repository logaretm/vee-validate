import { computed } from 'vue';
import { FormContextSymbol } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * If the form is dirty or not
 */
export function useIsFormPaused() {
  const form = injectWithSelf(FormContextSymbol);
  if (!form) {
    warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
  }

  return computed(() => {
    return form?.meta.value.paused ?? false;
  });
}
