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
    }

    if (field) {
      field.setTouched(touched);
    }

    if (__DEV__) {
      warn(`Could not set touched meta for unknown field with path "${toValue(path)}"`);
    }
  };
}
