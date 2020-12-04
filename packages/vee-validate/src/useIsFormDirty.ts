import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If the form is dirty or not
 */
export function useIsFormDirty() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.dirty;
  });
}
