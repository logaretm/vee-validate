import flushPromises from 'flush-promises';
import { useField, useForm, useIsFieldDirty } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

describe('useIsFieldDirty()', () => {
  test('gives access to a single field isDirty status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput } = useField('test');
        const isDirty = useIsFieldDirty('test');

        return {
          value,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isDirty.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to array fields isDirty status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput } = useField('test');
        useField('test');
        const isDirty = useIsFieldDirty('test');

        return {
          value,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isDirty.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns undefined if field does not exist', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const isDirty = useIsFieldDirty('something');

        return {
          isDirty,
        };
      },
      template: `
      <span>{{ isDirty }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });

  test('returns undefined if form does not exist', async () => {
    mountWithHoc({
      setup() {
        const isDirty = useIsFieldDirty('something');

        return {
          isDirty,
        };
      },
      template: `
      <span>{{ isDirty }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });
});
