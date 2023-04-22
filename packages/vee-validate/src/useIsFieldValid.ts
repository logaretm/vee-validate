import { computed, inject, unref } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { MaybeRef } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * If a field is validated and is valid
 */
export function useIsFieldValid(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  const field = path ? undefined : inject(FieldContextKey);

  return computed(() => {
    if (path) {
      const state = form?.getPathState(unref(path));

      return state?.valid;
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return false;
    }

    return field.meta.valid;
  });
}
