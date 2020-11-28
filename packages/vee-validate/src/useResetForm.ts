import { FormSymbol } from './symbols';
import { FormState } from './types';
import { injectWithSelf } from './utils';

export function useResetForm<TValues = Record<string, any>>() {
  const form = injectWithSelf(FormSymbol);

  return function resetForm(state?: Partial<FormState<TValues>>) {
    return form?.resetForm(state);
  };
}
