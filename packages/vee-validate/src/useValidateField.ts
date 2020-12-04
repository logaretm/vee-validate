import { FormSymbol } from './symbols';
import { ValidationResult } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path: string) {
  const form = injectWithSelf(FormSymbol);

  return function validateField(): Promise<ValidationResult> {
    const field = form?.fields.value[path];
    if (!field) {
      warn(`field with name ${path} was not found`);
      return Promise.resolve({
        errors: [],
      });
    }

    if (Array.isArray(field)) {
      return field[0].validate();
    }

    return field.validate();
  };
}
