import { useField, useSetFieldError, useForm } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useSetFieldError()', () => {
  test('sets a single field error message', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setError!: ReturnType<typeof useSetFieldError>;
    mountWithHoc({
      setup() {
        useForm();
        const { value, errorMessage } = useField('test');
        setError = useSetFieldError('test');

        return {
          value,
          errorMessage,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ errorMessage }}</span>
    `,
    });
    await flushPromises();
    const msg = 'Field is required';

    const error = document.querySelector('span');
    setError(msg);
    await flushPromises();
    expect(error?.textContent).toBe(msg);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('sets a single field error message in a child component without specifying a path', async () => {
    let setError!: ReturnType<typeof useSetFieldError>;
    const CustomSetErrorComponent = defineComponent({
      template: '<button></button>',
      setup() {
        setError = useSetFieldError();

        return {};
      },
    });
    mountWithHoc({
      components: {
        CustomSetErrorComponent,
      },
      setup() {
        useForm();
        const { errorMessage } = useField('test');

        return {
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
      <CustomSetErrorComponent />
    `,
    });

    await flushPromises();
    const msg = 'Field is required';
    const error = document.querySelector('span');
    setError(msg);
    await flushPromises();
    expect(error?.textContent).toBe(msg);
  });

  test('warns if field not found', async () => {
    let setError!: ReturnType<typeof useSetFieldError>;
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    mountWithHoc({
      setup() {
        setError = useSetFieldError('something');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    setError('ERROR');
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
