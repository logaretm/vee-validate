import { computed } from 'vue';
import { FormSymbol } from './symbols';
import { injectWithSelf } from './utils';

/**
 * If a field is validated and is valid
 */
export function useIsFieldValid(path: string) {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.fields.value[path]?.meta.valid;
  });
}

/**
 * If the form has been validated and is valid
 */
export function useIsFormValid() {
  const form = injectWithSelf(FormSymbol);

  return computed(() => {
    return form?.meta.value.valid;
  });
}
