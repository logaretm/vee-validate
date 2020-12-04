import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If the form is touched or not
 */
export function useIsFormTouched() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.touched;
  });
}
