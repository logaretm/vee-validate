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
    mountWithHoc({
      setup() {
        const { submitForm } = useForm();
        useField('test', validate);
        const isSubmitting = useIsSubmitting();

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

  test('returns undefined if form is not found', async () => {
    mountWithHoc({
      setup() {
        const isSubmitting = useIsSubmitting();

        return {
          isSubmitting,
        };
      },
      template: `
      <span>{{ isSubmitting }}</span>
    `,
    });

    await flushPromises();
    const submitText = document.querySelector('span');
    expect(submitText?.textContent).toBe('');
  });
});
