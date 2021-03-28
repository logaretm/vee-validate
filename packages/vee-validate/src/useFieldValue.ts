import { computed, inject, unref } from 'vue';
import { FieldContextSymbol, FormContextSymbol } from './symbols';
import { MaybeRef } from './types';
import { getFromPath, injectWithSelf } from './utils';

/**
 * Gives access to a field's current value
 */
export function useFieldValue<TValue = unknown>(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextSymbol);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextSymbol);

  return computed(() => {
    if (path) {
      return getFromPath(form?.values, unref(path)) as TValue | undefined;
    }

    return field?.value?.value as TValue | undefined;
  });
}
