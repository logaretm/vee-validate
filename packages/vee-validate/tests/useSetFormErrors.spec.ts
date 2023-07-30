import { useForm, useSetFormErrors } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';

describe('useSetFormErrors()', () => {
  const REQUIRED_MESSAGE = 'Field is required';

  test('sets multiple fields errors', async () => {
    let setErrors!: ReturnType<typeof useSetFormErrors>;
    mountWithHoc({
      setup() {
        const { errors } = useForm();
        setErrors = useSetFormErrors();

        return {
          errors,
        };
      },
      template: `
      <span>{{ errors.test }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    setErrors({ test: REQUIRED_MESSAGE });
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('warns if form is not found', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setErrors!: ReturnType<typeof useSetFormErrors>;
    mountWithHoc({
      setup() {
        setErrors = useSetFormErrors();

        return {};
      },
      template: `
      <span></span>
    `,
    });

    await flushPromises();
    setErrors({});
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
