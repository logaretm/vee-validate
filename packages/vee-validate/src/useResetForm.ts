import { FormSymbol } from './symbols';
import { FormState } from './types';
import { injectWithSelf, warn } from './utils';

export function useResetForm<TValues = Record<string, any>>() {
  const form = injectWithSelf(FormSymbol);

  return function resetForm(state?: Partial<FormState<TValues>>) {
    if (!form) {
      warn('No form context was detected');
      return;
    }

    return form.resetForm(state);
  };
}
