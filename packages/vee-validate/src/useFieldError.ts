import { computed, inject, unref } from 'vue';
import { FieldContext, FormErrorsSymbol } from './symbols';
import { MaybeReactive } from './types';
import { injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path?: MaybeReactive<string>) {
  const errors = injectWithSelf(FormErrorsSymbol);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContext);

  return computed(() => {
    if (path) {
      return errors?.value?.[unref(path)] as string | undefined;
    }

    return field?.errorMessage.value;
  });
}
