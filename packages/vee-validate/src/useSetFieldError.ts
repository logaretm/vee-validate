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
      return;
    }

    if (field) {
      field.setErrors(message || []);
      return;
    }

    if (__DEV__) {
      warn(
        `Could not set error message since there is no form context or a field named "${toValue(
          path,
        )}", did you forget to call "useField" or "useForm"?`,
      );
    }
  };
}
