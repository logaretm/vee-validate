import { FormSymbol } from './symbols';
import { ValidationResult } from './types';
import { injectWithSelf, normalizeField, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path: string) {
  const form = injectWithSelf(FormSymbol);

  return function validateField(): Promise<ValidationResult> {
    const field = normalizeField(form?.fields.value[path]);
    if (!field) {
      warn(`field with name ${path} was not found`);
      return Promise.resolve({
        errors: [],
      });
    }

    return field.validate();
  };
}
