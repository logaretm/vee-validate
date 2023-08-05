import { useField, useForm, useSetFormValues } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';

describe('useSetFormValues()', () => {
  test('sets form values', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setValues!: ReturnType<typeof useSetFormValues>;
    mountWithHoc({
      setup() {
        useForm();
        const { value: test1 } = useField('test1');
        const { value: test2 } = useField('test2');
        setValues = useSetFormValues();

        return {
          test1,
          test2,
        };
      },
      template: `
      <span id="t1">{{ test1 }}</span>
      <span id="t2">{{ test2 }}</span>
    `,
    });

    await flushPromises();
    const value1 = document.querySelector('#t1');
    const value2 = document.querySelector('#t2');

    setValues({ test1: 'test1', test2: 'test2' });
    await flushPromises();
    expect(value1?.textContent).toBe('test1');
    expect(value2?.textContent).toBe('test2');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('warns if form is not found', async () => {
    let setValues!: ReturnType<typeof useSetFormValues>;
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    mountWithHoc({
      setup() {
        setValues = useSetFormValues();

        return {};
      },
      template: `
      <span></span>
    `,
    });

    await flushPromises();
    setValues({});
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
