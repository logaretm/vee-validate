import { FormContextKey } from './symbols';
import { FormContext, FormValidationResult } from './types';
import { injectWithSelf, warn } from './utils';

/**
 * Validate multiple fields
 */
export function useValidateForm<TValues extends Record<string, unknown> = Record<string, unknown>>() {
  const form = injectWithSelf(FormContextKey) as FormContext<TValues> | undefined;
  if (!form) {
    if (__DEV__) {
      warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
  }

  return function validateField(): Promise<FormValidationResult<TValues>> {
    if (!form) {
      return Promise.resolve({ results: {}, errors: {}, valid: true, source: 'none' });
    }

    return form.validate();
  };
}
