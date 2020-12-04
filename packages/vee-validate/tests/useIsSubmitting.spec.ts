import flushPromises from 'flush-promises';
import { useField, useForm, useIsSubmitting } from '@/vee-validate';
import { mountWithHoc } from './helpers';

describe('useIsSubmitting()', () => {
  const validate = () =>
    new Promise(resolve => {
      setTimeout(resolve, 10);
    });

  test('indicates if a form is submitting', async () => {
    jest.useFakeTimers();
    let isSubmitting: any;
    mountWithHoc({
      setup() {
        const { submitForm } = useForm();
        useField('test', validate);
        isSubmitting = useIsSubmitting();

        return {
          isSubmitting,
          submitForm,
        };
      },
      template: `
      <button @click="submitForm">Submit</button>
      <span>{{ isSubmitting.toString() }}</span>
    `,
    });

    await flushPromises();
    const button = document.querySelector('button');
    const submitText = document.querySelector('span');
    expect(submitText?.textContent).toBe('false');
    button?.click();

    await flushPromises();
    expect(submitText?.textContent).toBe('true');
    jest.runAllTimers();
    await flushPromises();
    expect(submitText?.textContent).toBe('false');

    jest.useRealTimers();
  });
});
