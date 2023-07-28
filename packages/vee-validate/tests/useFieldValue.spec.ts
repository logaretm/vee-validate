import { useField, useFieldValue, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';
import { defineComponent } from 'vue';

describe('useFieldValue()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('gives access to a single field value', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, setValue } = useField('test', validate);
        const currValue = useFieldValue('test');

        return {
          value,
          currValue,
          setValue,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ currValue }}</span>
      <button @click="setValue('5')"></button>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const valueSpan = document.querySelector('span');
    const inputValue = '1234';
    setValue(input as any, inputValue);
    await flushPromises();
    expect(valueSpan?.textContent).toBe(inputValue);

    // test value setting
    const btn = document.querySelector('button');
    btn?.click();
    await flushPromises();
    expect(input?.value).toBe('5');
  });

  test('gives access to a single field value in a child component without specifying a path', async () => {
    const CustomChildValueDisplay = defineComponent({
      template: '<span>{{ value }}</span>',
      setup() {
        const value = useFieldValue();

        return {
          value,
        };
      },
    });

    mountWithHoc({
      components: {
        CustomChildValueDisplay,
      },
      setup() {
        useForm();
        const { value } = useField('test');

        return {
          value,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <CustomChildValueDisplay />
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const inputValue = '1234';
    setValue(input as any, inputValue);
    await flushPromises();
    const valueSpan = document.querySelector('span');
    expect(valueSpan?.textContent).toBe(inputValue);
  });

  test('returns undefined if field not found', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const value = useFieldValue('something');

        return {
          value,
        };
      },
      template: `
      <span>{{ value }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });

  test('returns undefined if form is not found', async () => {
    mountWithHoc({
      setup() {
        const value = useFieldValue('something');

        return {
          value,
        };
      },
      template: `
      <span>{{ value }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });
});
