import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If a field is touched or not
 */
export function useIsFieldTouched(path: string) {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.fields.value[path]?.meta.touched;
  });
}

/**
 * If the form is touched or not
 */
export function useIsFormTouched() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.touched;
  });
}
