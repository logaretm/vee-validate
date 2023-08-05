import { useField, useForm, useSetFormTouched } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';

describe('useSetFormTouched()', () => {
  test('sets multiple fields touched state', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setTouched!: ReturnType<typeof useSetFormTouched>;
    mountWithHoc({
      setup() {
        useForm();
        const { meta: test1 } = useField('test1');
        const { meta: test2 } = useField('test2');
        setTouched = useSetFormTouched();

        return {
          test1,
          test2,
        };
      },
      template: `
      <span id="t1">{{ test1.touched }}</span>
      <span id="t2">{{ test2.touched }}</span>
    `,
    });

    await flushPromises();
    const touched1 = document.querySelector('#t1');
    const touched2 = document.querySelector('#t2');
    setTouched({ test1: true, test2: false });
    await flushPromises();
    expect(touched1?.textContent).toBe('true');
    expect(touched2?.textContent).toBe('false');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('sets all fields touched state', async () => {
    let setTouched!: ReturnType<typeof useSetFormTouched>;
    mountWithHoc({
      setup() {
        useForm();
        const { meta: test1 } = useField('test1');
        const { meta: test2 } = useField('test2');
        setTouched = useSetFormTouched();

        return {
          test1,
          test2,
        };
      },
      template: `
      <span id="t1">{{ test1.touched }}</span>
      <span id="t2">{{ test2.touched }}</span>
    `,
    });

    await flushPromises();
    const touched1 = document.querySelector('#t1');
    const touched2 = document.querySelector('#t2');
    setTouched(true);
    await flushPromises();
    expect(touched1?.textContent).toBe('true');
    expect(touched2?.textContent).toBe('true');
  });

  test('warns if form is not found', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setTouched!: ReturnType<typeof useSetFormTouched>;
    mountWithHoc({
      setup() {
        setTouched = useSetFormTouched();

        return {};
      },
      template: `
      <span></span>
    `,
    });

    await flushPromises();
    setTouched({});
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
