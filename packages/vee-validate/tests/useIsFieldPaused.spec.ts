import flushPromises from 'flush-promises';
import { useField, useForm, useIsFieldPaused, useIsFieldValid, useIsFieldDirty } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';
import { defineComponent } from 'vue';

describe('useIsFieldPaused()', () => {
  test('gives access to a single field isPaused status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput, setPaused } = useField('test', () => true);
        const isPaused = useIsFieldPaused('test');
        const isValid = useIsFieldValid('test');
        const isDirty = useIsFieldDirty('test');

        setPaused(true);

        return {
          value,
          isPaused,
          isValid,
          isDirty,
          handleInput,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span class="isPaused">{{ isPaused.toString() }}</span>
      <span class="isValid">{{ isValid.toString() }}</span>
      <span class="isDirty">{{ isDirty.toString() }}</span>
    `,
    });

    await flushPromises();

    const input = document.querySelector('input');
    const isPaused = document.querySelector('.isPaused');
    const isValid = document.querySelector('.isValid');
    const isDirty = document.querySelector('.isDirty');

    expect(isPaused?.textContent).toBe('true');

    setValue(input as any, '123');

    await flushPromises();

    expect(isValid?.textContent).toBe('false');
    expect(isDirty?.textContent).toBe('true');
  });

  test('gives access to a single field isPaused status in a child component without specifying a path', async () => {
    const PausedIcon = defineComponent({
      template: '<span>{{ isPaused.toString() }}</span>',
      setup() {
        const isPaused = useIsFieldPaused();

        return {
          isPaused,
        };
      },
    });
    mountWithHoc({
      components: {
        PausedIcon,
      },
      setup() {
        useForm();
        const { value, handleInput, setPaused } = useField('test');
        return {
          value,
          handleInput,
          setPaused,
        };
      },
      template: `
        <input name="field" v-model="value" @input="handleInput" />
        <PausedIcon />
        <button @click="setPaused(true)">setPaused</button>
      `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    document.querySelector('button')?.click();

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('gives access to array fields isPaused status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput, setPaused } = useField('test');
        useField('test');
        const isPaused = useIsFieldPaused('test');

        return {
          value,
          isPaused,
          handleInput,
          setPaused,
        };
      },
      template: `
      <input name="field" v-model="value" @input="handleInput" />
      <span>{{ isPaused.toString() }}</span>
      <button @click="setPaused(true)">setPaused</button>
    `,
    });
    await flushPromises();

    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    document.querySelector('button')?.click();

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if field does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        useForm();
        const isPaused = useIsFieldPaused('something');

        return {
          isPaused,
        };
      },
      template: `
      <span>{{ isPaused.toString() }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('returns false and warns if form does not exist', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isPaused = useIsFieldPaused('something');

        return {
          isPaused,
        };
      },
      template: `
      <span>{{ isPaused.toString() }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
