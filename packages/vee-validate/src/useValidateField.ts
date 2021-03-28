import { inject, unref } from 'vue';
import { FieldContextSymbol, FormContextSymbol } from './symbols';
import { MaybeRef, ValidationResult } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextSymbol);
  let field = path ? undefined : inject(FieldContextSymbol);

  return function validateField(): Promise<ValidationResult> {
    if (path) {
      field = normalizeField(form?.fieldsById.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return Promise.resolve({
        errors: [],
        valid: true,
      });
    }

    return field.validate();
  };
}
