import { inject, unref, MaybeRef } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { ValidationResult } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path?: MaybeRef<string>) {
  const form = injectWithSelf(FormContextKey);
  const field = path ? undefined : inject(FieldContextKey);

  return function validateField(): Promise<ValidationResult> {
    if (field) {
      return field.validate();
    }

    if (form && path) {
      return form?.validateField(unref(path));
    }

    warn(`field with name ${unref(path)} was not found`);

    return Promise.resolve({
      errors: [],
      valid: true,
    });
  };
}
