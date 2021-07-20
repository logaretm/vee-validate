import { computed, inject, unref } from 'vue';
import { FieldContextKey, FormErrorsKey } from './symbols';
import { MaybeRef } from './types';
import { injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path?: MaybeRef<string>) {
  const errors = injectWithSelf(FormErrorsKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return computed(() => {
    if (path) {
      return errors?.value?.[unref(path)] as string | undefined;
    }

    return field?.errorMessage.value;
  });
}
