import { FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets multiple fields touched or all fields in the form
 */
export function useSetFormTouched() {
  const form = injectWithSelf(FormContextKey);

  function setFormTouched(fields: Record<string, boolean> | boolean) {
    if (form) {
      form.setTouched(fields);
      return;
    }

    if (__DEV__) {
      warn(
        `Could not set touched state because a form was not detected, did you forget to use "useForm" in a parent component?`,
      );
    }
  }

  return setFormTouched;
}
