import { useField, useForm, useSetFieldValue } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useSetFieldTouched()', () => {
  test('sets a single field value', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let setValue!: ReturnType<typeof useSetFieldValue>;
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test');
        setValue = useSetFieldValue('test');

        return {
          value,
        };
      },
      template: `
      <span>{{ value }}</span>
    `,
    });
    await flushPromises();

    const valueSpan = document.querySelector('span');
    expect(valueSpan?.textContent).toBe('');
    setValue('test 123');
    await flushPromises();
    expect(valueSpan?.textContent).toBe('test 123');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('sets a single field value in child components without path prop', async () => {
    let setValue!: ReturnType<typeof useSetFieldValue>;
    const ValueBtn = defineComponent({
      template: '<button></button>',
      setup() {
        setValue = useSetFieldValue();

        return {};
      },
    });
    mountWithHoc({
      components: {
        ValueBtn,
      },
      setup() {
        useForm();
        const { value } = useField('test');

        return {
          value,
        };
      },
      template: `
      <span>{{ value }}</span>
      <ValueBtn />
    `,
    });

    await flushPromises();

    const valueSpan = document.querySelector('span');
    expect(valueSpan?.textContent).toBe('');
    setValue('test 123');
    await flushPromises();
    expect(valueSpan?.textContent).toBe('test 123');
  });

  test('warns if field not found', async () => {
    let setValue!: ReturnType<typeof useSetFieldValue>;

    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    mountWithHoc({
      setup() {
        setValue = useSetFieldValue('something');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    setValue('test 123');
    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
