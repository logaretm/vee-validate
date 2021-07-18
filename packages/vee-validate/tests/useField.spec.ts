import { useField } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useField()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const MIN_MESSAGE = 'Field must be at least 3';
  test('validates when value changes', async () => {
    mountWithHoc({
      setup() {
        const { value, errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

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

    const input = document.querySelector('input');
    const error = document.querySelector('span');

    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });

  test('valid flag is correct after reset', async () => {
    mountWithHoc({
      setup() {
        const {
          value: value1,
          meta: meta1,
          resetField: reset1,
        } = useField('field', val => (val ? true : REQUIRED_MESSAGE));
        const {
          value: value2,
          meta: meta2,
          resetField: reset2,
        } = useField('field', val => (!val || (val as string).length >= 3 ? true : MIN_MESSAGE));

        return {
          value1,
          value2,
          meta1,
          meta2,
          reset1,
          reset2,
        };
      },
      template: `
      <input id="input1" name="field" v-model="value1" />
      <span id="meta1">{{ meta1.valid ? 'valid' : 'invalid' }}</span>
      <button id="r1" @click="reset1()">Reset</button>
      <input id="input2" name="field" v-model="value2" />
      <span id="meta2">{{ meta2.valid ? 'valid' : 'invalid' }}</span>
      <button id="r2" @click="reset2()">Reset</button>
    `,
    });

    const input1 = document.querySelector('#input1') as HTMLInputElement;
    const meta1 = document.querySelector('#meta1');
    const input2 = document.querySelector('#input2') as HTMLInputElement;
    const meta2 = document.querySelector('#meta2');

    await flushPromises();
    expect(meta1?.textContent).toBe('invalid');
    expect(meta2?.textContent).toBe('valid');

    setValue(input1, '12');
    setValue(input2, '12');
    await flushPromises();
    expect(meta1?.textContent).toBe('valid');
    expect(meta2?.textContent).toBe('invalid');

    // trigger reset
    (document.querySelector('#r1') as HTMLButtonElement).click();
    (document.querySelector('#r2') as HTMLButtonElement).click();
    await flushPromises();
    expect(meta1?.textContent).toBe('invalid');
    expect(meta2?.textContent).toBe('valid');
  });

  test('valid flag is synced with fields errors length', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.valid ? 'valid' : 'invalid' }}</span>
      <button @click="resetField({ errors: ['bad'] })">Reset</button>
    `,
    });

    await flushPromises();
    const meta = document.querySelector('#meta');
    const input = document.querySelector('input') as HTMLInputElement;

    expect(meta?.textContent).toBe('invalid');

    setValue(input, '12');
    await flushPromises();
    expect(meta?.textContent).toBe('valid');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('invalid');
  });

  test('dirty flag is false after reset', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.dirty ? 'dirty' : 'clean' }}</span>
      <button @click="resetField()">Reset</button>
    `,
    });

    const input = document.querySelector('input') as HTMLInputElement;
    const meta = document.querySelector('#meta');

    await flushPromises();
    expect(meta?.textContent).toBe('clean');

    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('dirty');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('clean');
  });

  test('dirty flag is false after reset with a new value', async () => {
    mountWithHoc({
      setup() {
        const { value, meta, resetField } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          meta,
          resetField,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span id="meta">{{ meta.dirty ? 'dirty' : 'clean' }}</span>
      <button @click="resetField({ value: '12' })">Reset</button>
    `,
    });

    const input = document.querySelector('input') as HTMLInputElement;
    const meta = document.querySelector('#meta');

    await flushPromises();
    expect(meta?.textContent).toBe('clean');

    setValue(input, '');
    await flushPromises();
    expect(meta?.textContent).toBe('dirty');

    // trigger reset
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta?.textContent).toBe('clean');
  });
});
