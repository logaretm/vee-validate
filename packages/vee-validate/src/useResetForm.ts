import { inject } from 'vue';
import { FormSymbol } from './symbols';
import { FormState } from './types';

export function useResetForm<TValues = Record<string, any>>() {
  const form = inject(FormSymbol);

  return function resetForm(state?: Partial<FormState<TValues>>) {
    return form?.resetForm(state);
  };
}
