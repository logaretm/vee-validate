import { computed, unref } from 'vue';
import { FormSymbol } from './symbols';
import { MaybeReactive } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * If a field is touched or not
 */
export function useIsFieldTouched(path: MaybeReactive<string>) {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    const field = normalizeField(form?.fields.value[unref(path)]);
    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return undefined;
    }

    return field.meta.touched;
  });
}
