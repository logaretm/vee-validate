import { computed, inject, unref, MaybeRef } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { getFromPath, injectWithSelf } from './utils';

/**
 * Gives access to a field's current value
 */
export function useFieldValue<TValue = unknown>(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return computed(() => {
    if (path) {
      return getFromPath(form?.values, unref(path)) as TValue;
    }

    return unref(field?.value) as TValue;
  });
}
