import { computed, inject } from 'vue';
import { FormErrorsSymbol } from './symbols';
import { getFromPath } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path: string) {
  const errors = inject(FormErrorsSymbol);

  return computed(() => {
    getFromPath(errors?.value, path);
  });
}

/**
 * Gives access to all form errors
 */
export function useErrors() {
  const errors = inject(FormErrorsSymbol);

  return errors;
}
