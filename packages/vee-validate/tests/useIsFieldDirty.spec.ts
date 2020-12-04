import flushPromises from 'flush-promises';
import { useField, useForm, useIsFieldDirty } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

describe('useIsFieldDirty()', () => {
  test('gives access to a field isDirty status', async () => {
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
});
