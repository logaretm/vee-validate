import { computed, unref } from 'vue';
import { FormErrorsSymbol } from './symbols';
import { MaybeReactive } from './types';
import { getFromPath, injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path: MaybeReactive<string>) {
  const errors = injectWithSelf(FormErrorsSymbol);

  return computed(() => {
    return getFromPath(errors?.value, unref(path)) as string | undefined;
  });
}

/**
 * Gives access to all form errors
 */
export function useErrors() {
  const errors = injectWithSelf(FormErrorsSymbol);

  return errors;
}
