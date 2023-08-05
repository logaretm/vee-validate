import { FormContextKey } from './symbols';
import { FormContext, SubmissionHandler } from './types';
import { injectWithSelf, warn } from './utils';

export function useSubmitForm<TValues extends Record<string, unknown> = Record<string, unknown>>(
  cb: SubmissionHandler<TValues>,
) {
  const form = injectWithSelf(FormContextKey) as FormContext<TValues> | undefined;
  if (!form) {
    if (__DEV__) {
      warn('No vee-validate <Form /> or `useForm` was detected in the component tree');
    }
  }

  const onSubmit = form ? form.handleSubmit(cb) : undefined;

  return function submitForm(e?: Event) {
    if (!onSubmit) {
      return;
    }

    return onSubmit(e);
  };
}
