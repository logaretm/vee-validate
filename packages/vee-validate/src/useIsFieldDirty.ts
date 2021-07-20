import { computed, inject, unref } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { MaybeRef, PrivateFieldComposite } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * If a field is dirty or not
 */
export function useIsFieldDirty(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  let field: PrivateFieldComposite | undefined = path ? undefined : inject(FieldContextKey);

  return computed(() => {
    if (path) {
      field = normalizeField(form?.fieldsById.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return false;
    }

    return field.meta.dirty;
  });
}
