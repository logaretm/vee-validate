import { FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets multiple fields values
 */
export function useSetFormValues() {
  const form = injectWithSelf(FormContextKey);

  function setFormValues(fields: Record<string, unknown>, shouldValidate = true) {
    if (form) {
      form.setValues(fields, shouldValidate);
      return;
    }

    if (__DEV__) {
      warn(
        `Could not set form values because a form was not detected, did you forget to use "useForm" in a parent component?`,
      );
    }
  }

  return setFormValues;
}
