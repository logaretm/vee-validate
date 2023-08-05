import { FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets multiple fields errors
 */
export function useSetFormErrors() {
  const form = injectWithSelf(FormContextKey);

  function setFormErrors(fields: Record<string, string | string[] | undefined>) {
    if (form) {
      form.setErrors(fields);
      return;
    }

    if (__DEV__) {
      warn(
        `Could not set errors because a form was not detected, did you forget to use "useForm" in a parent component?`,
      );
    }
  }

  return setFormErrors;
}
