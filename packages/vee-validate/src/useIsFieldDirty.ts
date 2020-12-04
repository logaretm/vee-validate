import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf, normalizeField } from './utils';

/**
 * If a field is dirty or not
 */
export function useIsFieldDirty(path: string) {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    const field = normalizeField(form?.fields.value[path]);
    if (!field) {
      return undefined;
    }

    return field.meta.dirty;
  });
}
