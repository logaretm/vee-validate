import { inject, MaybeRefOrGetter, toValue } from 'vue';
import { FieldContextKey, FormContextKey } from './symbols';
import { injectWithSelf, warn } from './utils';

/**
 * Sets a field's value
 */
export function useSetFieldValue<TValue = unknown>(path?: MaybeRefOrGetter<string>) {
  const form = injectWithSelf(FormContextKey);
  // We don't want to use self injected context as it doesn't make sense
  const field = path ? undefined : inject(FieldContextKey);

  return function setFieldValue(value: TValue, shouldValidate = true) {
    if (path && form) {
      form.setFieldValue(toValue(path), value, shouldValidate);
    }

    if (field) {
      field.setValue(value, shouldValidate);
    }

    if (__DEV__) {
      warn(`Could not set value for unknown field with path "${toValue(path)}"`);
    }
  };
}
