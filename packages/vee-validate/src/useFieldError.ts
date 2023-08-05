import { computed, inject, MaybeRefOrGetter, toValue } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { injectWithSelf } from './utils';

/**
 * Gives access to a single field error
 */
export function useFieldError(path?: MaybeRefOrGetter<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return computed<string | undefined>(() => {
    if (path) {
      return form?.errors.value[toValue(path)];
    }

    return field?.errorMessage.value;
  });
}
