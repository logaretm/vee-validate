import { computed, inject, unref, MaybeRef } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return computed<string | undefined>(() => {
    if (path) {
      return form?.errors.value[unref(path)];
    }

    return field?.errorMessage.value;
  });
}
