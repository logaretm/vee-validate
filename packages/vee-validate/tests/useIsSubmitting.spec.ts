import { useField, useForm, useIsSubmitting } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';

describe('useIsSubmitting()', () => {
  const validate = (): Promise<false> =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(false);
      }, 10);
    });

  test('indicates if a form is submitting', async () => {
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
    vi.runAllTimers();
    await flushPromises();
    expect(submitText?.textContent).toBe('false');
  });

  test('returns false and warns if form is not found', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    mountWithHoc({
      setup() {
        const isSubmitting = useIsSubmitting();

        return {
          isSubmitting,
        };
      },
      template: `
      <span>{{ isSubmitting.toString() }}</span>
    `,
    });

    await flushPromises();
    const submitText = document.querySelector('span');
    expect(submitText?.textContent).toBe('false');
    expect(console.warn).toHaveBeenCalled();
    spy.mockRestore();
  });
});
