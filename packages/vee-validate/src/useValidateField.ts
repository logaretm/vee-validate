import { inject, unref } from 'vue';
import { FieldContext, FormSymbol } from './symbols';
import { MaybeReactive, ValidationResult } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path?: MaybeReactive<string>) {
  const form = injectWithSelf(FormSymbol);
  let field = path ? undefined : inject(FieldContext);

  return function validateField(): Promise<ValidationResult> {
    if (path) {
      field = normalizeField(form?.fields.value[unref(path)]);
    }

    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return Promise.resolve({
        errors: [],
      });
    }

    return field.validate();
  };
}
