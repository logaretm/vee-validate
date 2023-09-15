import { FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets multiple fields values
 */
export function useSetFormValues<TValues extends Record<string, unknown> = Record<string, unknown>>() {
  const form = injectWithSelf(FormContextKey);

  function setFormValues(fields: TValues, shouldValidate = true) {
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
