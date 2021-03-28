import { computed, inject, unref } from 'vue';
import { FieldContextSymbol, FormErrorsSymbol } from './symbols';
import { MaybeRef } from './types';
import { injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path?: MaybeRef<string>) {
  const errors = injectWithSelf(FormErrorsSymbol);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextSymbol);

  return computed(() => {
    if (path) {
      return errors?.value?.[unref(path)] as string | undefined;
    }

    return field?.errorMessage.value;
  });
}
