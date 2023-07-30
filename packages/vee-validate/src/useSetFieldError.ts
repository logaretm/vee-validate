import { inject, MaybeRefOrGetter, toValue } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets a field's error message
 */
export function useSetFieldError(path?: MaybeRefOrGetter<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return function setFieldError(message: string | string[] | undefined) {
    if (path && form) {
      form.setFieldError(toValue(path), message);
    }

    if (field) {
      field.setErrors(message || []);
    }

    if (__DEV__) {
      warn(`Could not set error for unknown field with path "${toValue(path)}"`);
    }
  };
}
