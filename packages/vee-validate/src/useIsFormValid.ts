import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If the form has been validated and is valid
 */
export function useIsFormValid() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.valid;
  });
}
