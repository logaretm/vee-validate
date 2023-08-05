import { useField, useForm, useSetFieldTouched } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useSetFieldTouched()', () => {
  test('sets a single field touched status', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setTouched!: ReturnType<typeof useSetFieldTouched>;
    mountWithHoc({
      setup() {
        useForm();
        const { meta } = useField('test');
        setTouched = useSetFieldTouched('test');

        return {
          meta,
        };
      },
      template: `
      <span>{{ meta.touched.toString() }}</span>
    `,
    });
    await flushPromises();

    const touched = document.querySelector('span');
    expect(touched?.textContent).toBe('false');
    setTouched(true);
    await flushPromises();
    expect(touched?.textContent).toBe('true');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('sets a single field isTouched status in child components without path prop', async () => {
    let setTouched!: ReturnType<typeof useSetFieldTouched>;
    const TouchedButton = defineComponent({
      template: '<button></button>',
      setup() {
        setTouched = useSetFieldTouched();

        return {};
      },
    });
    mountWithHoc({
      components: {
        TouchedButton,
      },
      setup() {
        useForm();
        const { meta } = useField('test');

        return {
          meta,
        };
      },
      template: `
      <span>{{ meta.touched.toString() }}</span>
      <TouchedButton />
    `,
    });

    await flushPromises();

    const touched = document.querySelector('span');
    expect(touched?.textContent).toBe('false');
    setTouched(true);
    await flushPromises();
    expect(touched?.textContent).toBe('true');
  });

  test('warns if field not found', async () => {
    let setTouched!: ReturnType<typeof useSetFieldTouched>;
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    mountWithHoc({
      setup() {
        setTouched = useSetFieldTouched('something');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    setTouched(true);
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
