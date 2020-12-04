import { FormSymbol } from './symbols';
import { ValidationResult } from './types';
import { injectWithSelf } from './utils';

/**
 * Validates a single field
 */
export function useValidateField(path: string) {
  const form = injectWithSelf(FormSymbol);

  return function validateField(): Promise<ValidationResult> {
    const field = form?.fields.value[path];

    if (Array.isArray(field)) {
      return field[0].validate();
    }

    return field.validate();
  };
}
