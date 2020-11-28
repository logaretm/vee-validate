import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If a field is dirty or not
 */
export function useIsFieldDirty(path: string) {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.fields.value[path]?.meta.dirty;
  });
}

/**
 * If the form is dirty or not
 */
export function useIsFormDirty() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.dirty;
  });
}
