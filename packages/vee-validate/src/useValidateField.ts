import { unref } from 'vue';
import { FormSymbol } from './symbols';
import { MaybeReactive, ValidationResult } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path: MaybeReactive<string>) {
  const form = injectWithSelf(FormSymbol);

  return function validateField(): Promise<ValidationResult> {
    const field = normalizeField(form?.fields.value[unref(path)]);
    if (!field) {
      warn(`field with name ${unref(path)} was not found`);

      return Promise.resolve({
        errors: [],
      });
    }

    return field.validate();
  };
}
