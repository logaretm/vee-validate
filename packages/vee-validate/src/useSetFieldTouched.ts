import { inject, MaybeRefOrGetter, toValue } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets a field's touched meta state
 */
export function useSetFieldTouched(path?: MaybeRefOrGetter<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return function setFieldTouched(touched: boolean) {
    if (path && form) {
      form.setFieldTouched(toValue(path), touched);
      return;
    }

    if (field) {
      field.setTouched(touched);
      return;
    }

    if (__DEV__) {
      warn(
        `Could not set touched state since there is no form context or a field named "${toValue(
          path,
        )}", did you forget to call "useField" or "useForm"?`,
      );
    }
  };
}
