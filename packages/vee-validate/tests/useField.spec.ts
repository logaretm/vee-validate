import { useField, useForm } from '@/vee-validate';
import { defineComponent, nextTick, onMounted, ref } from 'vue';
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

  // #3891
  test('dirty flag is false after reset with a new value when a form is present', async () => {
    mountWithHoc({
      setup() {
        useForm();
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

  describe('has validation modes', () => {
    test('silent mode does not generate messages', async () => {
      let validateFn!: ReturnType<typeof useField>['validate'];
      mountWithHoc({
        setup() {
          const { errorMessage, validate } = useField('field', val => (val ? true : REQUIRED_MESSAGE));
          validateFn = validate;

          return {
            errorMessage,
          };
        },
        template: `
      <span>{{ errorMessage }}</span>
    `,
      });
      const error = document.querySelector('span');
      expect(error?.textContent).toBe('');

      // won't show any errors
      await validateFn({ mode: 'silent' });
      await flushPromises();
      expect(error?.textContent).toBe('');
    });

    test('validated-only mode only generates messages when it was validated before by user action', async () => {
      let validateFn!: ReturnType<typeof useField>['validate'];
      mountWithHoc({
        setup() {
          const { errorMessage, validate, value, setErrors } = useField('field', val =>
            val ? true : REQUIRED_MESSAGE
          );
          validateFn = validate;
          // marks it as dirty/touched
          value.value = '';
          onMounted(() => {
            setErrors('');
          });

          return {
            errorMessage,
          };
        },
        template: `
      <span>{{ errorMessage }}</span>
    `,
      });
      const error = document.querySelector('span');
      expect(error?.textContent).toBe('');

      // won't show any errors
      await validateFn({ mode: 'validated-only' });
      await flushPromises();
      expect(error?.textContent).toBe(REQUIRED_MESSAGE);
    });

    test('force mode always generates new error messages', async () => {
      let validateFn!: ReturnType<typeof useField>['validate'];
      mountWithHoc({
        setup() {
          const { errorMessage, validate } = useField('field', val => (val ? true : REQUIRED_MESSAGE));
          validateFn = validate;

          return {
            errorMessage,
          };
        },
        template: `
      <span>{{ errorMessage }}</span>
    `,
      });
      const error = document.querySelector('span');
      expect(error?.textContent).toBe('');

      // won't show any errors
      await validateFn({ mode: 'force' });
      await flushPromises();
      expect(error?.textContent).toBe(REQUIRED_MESSAGE);
    });
  });

  describe('generic function chains', () => {
    test('when bails is true', async () => {
      mountWithHoc({
        setup() {
          const {
            value: value1,
            meta: meta1,
            errors: errors1,
            resetField: reset1,
          } = useField('field', [
            val => (val ? true : REQUIRED_MESSAGE),
            val => ((val as string)?.length >= 3 ? true : MIN_MESSAGE),
          ]);
          const {
            value: value2,
            meta: meta2,
            errors: errors2,
            resetField: reset2,
          } = useField('field', [
            val => ((val as string)?.length >= 3 ? true : MIN_MESSAGE),
            val => (val ? true : REQUIRED_MESSAGE),
          ]);

          return {
            value1,
            value2,
            meta1,
            meta2,
            errors1,
            errors2,
            reset1,
            reset2,
          };
        },
        template: `
        <input id="input1" name="field" v-model="value1" />
        <span id="meta1">{{ meta1.valid ? 'valid' : 'invalid' }}</span>
        <span id="errors1">{{ errors1.length }}</span>
        <span v-for="(e, idx) in errors1" :id="'errormessage1' + idx">{{ e }}</span>
        <button id="r1" @click="reset1()">Reset</button>
        <input id="input2" name="field" v-model="value2" />
        <span id="meta2">{{ meta2.valid ? 'valid' : 'invalid' }}</span>
        <span id="errors2">{{ errors2.length }}</span>
        <span v-for="(e, idx) in errors2" :id="'errormessage2' + idx">{{ e }}</span>
        <button id="r2" @click="reset2()">Reset</button>
      `,
      });

      const input1 = document.querySelector('#input1') as HTMLInputElement;
      const meta1 = document.querySelector('#meta1');
      const errors1 = document.querySelector('#errors1');
      const input2 = document.querySelector('#input2') as HTMLInputElement;
      const meta2 = document.querySelector('#meta2');
      const errors2 = document.querySelector('#errors2');

      await flushPromises();

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      setValue(input1, '');
      setValue(input2, '');

      await flushPromises();

      let errorMessage10 = document.querySelector('#errormessage10');
      let errorMessage20 = document.querySelector('#errormessage20');

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      expect(errors1?.textContent).toBe('1');
      expect(errors2?.textContent).toBe('1');
      expect(errorMessage10?.textContent).toBe(REQUIRED_MESSAGE);
      expect(errorMessage20?.textContent).toBe(MIN_MESSAGE);

      setValue(input1, '12');
      setValue(input2, '12');

      await flushPromises();

      errorMessage10 = document.querySelector('#errormessage10');
      errorMessage20 = document.querySelector('#errormessage20');

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      expect(errors1?.textContent).toBe('1');
      expect(errors2?.textContent).toBe('1');
      expect(errorMessage10?.textContent).toBe(MIN_MESSAGE);
      expect(errorMessage20?.textContent).toBe(MIN_MESSAGE);

      setValue(input1, '123');
      setValue(input2, '123');

      await flushPromises();

      expect(meta1?.textContent).toBe('valid');
      expect(meta2?.textContent).toBe('valid');
      expect(errors1?.textContent).toBe('0');
      expect(errors2?.textContent).toBe('0');

      // trigger reset
      (document.querySelector('#r1') as HTMLButtonElement).click();
      (document.querySelector('#r2') as HTMLButtonElement).click();
      await flushPromises();
      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
    });

    test('when bails is false', async () => {
      mountWithHoc({
        setup() {
          const {
            value: value1,
            meta: meta1,
            errors: errors1,
            resetField: reset1,
          } = useField(
            'field',
            [val => (val ? true : REQUIRED_MESSAGE), val => ((val as string)?.length >= 3 ? true : MIN_MESSAGE)],
            { bails: false }
          );
          const {
            value: value2,
            meta: meta2,
            errors: errors2,
            resetField: reset2,
          } = useField(
            'field',
            [val => ((val as string)?.length >= 3 ? true : MIN_MESSAGE), val => (val ? true : REQUIRED_MESSAGE)],
            { bails: false }
          );

          return {
            value1,
            value2,
            meta1,
            meta2,
            errors1,
            errors2,
            reset1,
            reset2,
          };
        },
        template: `
        <input id="input1" name="field" v-model="value1" />
        <span id="meta1">{{ meta1.valid ? 'valid' : 'invalid' }}</span>
        <span id="errors1">{{ errors1.length }}</span>
        <span v-for="(e, idx) in errors1" :id="'errormessage1' + idx">{{ e }}</span>
        <button id="r1" @click="reset1()">Reset</button>
        <input id="input2" name="field" v-model="value2" />
        <span id="meta2">{{ meta2.valid ? 'valid' : 'invalid' }}</span>
        <span id="errors2">{{ errors2.length }}</span>
        <span v-for="(e, idx) in errors2" :id="'errormessage2' + idx">{{ e }}</span>
        <button id="r2" @click="reset2()">Reset</button>
      `,
      });

      const input1 = document.querySelector('#input1') as HTMLInputElement;
      const meta1 = document.querySelector('#meta1');
      const errors1 = document.querySelector('#errors1');
      const input2 = document.querySelector('#input2') as HTMLInputElement;
      const meta2 = document.querySelector('#meta2');
      const errors2 = document.querySelector('#errors2');

      await flushPromises();

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      setValue(input1, '');
      setValue(input2, '');

      await flushPromises();

      let errorMessage10 = document.querySelector('#errormessage10');
      const errorMessage11 = document.querySelector('#errormessage11');
      let errorMessage20 = document.querySelector('#errormessage20');
      const errorMessage21 = document.querySelector('#errormessage21');

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      expect(errors1?.textContent).toBe('2');
      expect(errors2?.textContent).toBe('2');
      expect(errorMessage10?.textContent).toBe(REQUIRED_MESSAGE);
      expect(errorMessage11?.textContent).toBe(MIN_MESSAGE);
      expect(errorMessage20?.textContent).toBe(MIN_MESSAGE);
      expect(errorMessage21?.textContent).toBe(REQUIRED_MESSAGE);

      setValue(input1, '12');
      setValue(input2, '12');

      await flushPromises();

      errorMessage10 = document.querySelector('#errormessage10');
      errorMessage20 = document.querySelector('#errormessage20');

      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
      expect(errors1?.textContent).toBe('1');
      expect(errors2?.textContent).toBe('1');
      expect(errorMessage10?.textContent).toBe(MIN_MESSAGE);
      expect(errorMessage20?.textContent).toBe(MIN_MESSAGE);

      setValue(input1, '123');
      setValue(input2, '123');

      await flushPromises();

      expect(meta1?.textContent).toBe('valid');
      expect(meta2?.textContent).toBe('valid');
      expect(errors1?.textContent).toBe('0');
      expect(errors2?.textContent).toBe('0');

      // trigger reset
      (document.querySelector('#r1') as HTMLButtonElement).click();
      (document.querySelector('#r2') as HTMLButtonElement).click();
      await flushPromises();
      expect(meta1?.textContent).toBe('invalid');
      expect(meta2?.textContent).toBe('invalid');
    });
  });

  test('emits model events for v-model support and syncing', async () => {
    const model = ref('');
    const InputComponent = defineComponent({
      props: {
        modelValue: String,
      },
      setup() {
        const { value, errorMessage } = useField('field');

        return {
          value,
          errorMessage,
        };
      },
      template: `
        <input v-model="value" />
      `,
    });

    mountWithHoc({
      components: {
        InputComponent,
      },
      setup() {
        return {
          model,
        };
      },
      template: `
      <InputComponent v-model="model" />
    `,
    });

    const input = document.querySelector('input');

    setValue(input as any, '123');
    await flushPromises();
    expect(model.value).toBe('123');
    model.value = '321';
    await flushPromises();
    expect(input?.value).toBe('321');
  });

  test('can disable model events', async () => {
    const model = ref('');
    const InputComponent = defineComponent({
      props: {
        modelValue: String,
      },
      setup() {
        const { value, errorMessage } = useField('field', undefined, {
          syncVModel: false,
        });

        return {
          value,
          errorMessage,
        };
      },
      template: `
        <input v-model="value" />
      `,
    });

    mountWithHoc({
      components: {
        InputComponent,
      },
      setup() {
        return {
          model,
        };
      },
      template: `
      <InputComponent v-model="model" />
    `,
    });

    const input = document.querySelector('input');

    setValue(input as any, '123');
    await flushPromises();
    expect(model.value).toBe('');
    model.value = '321';
    await flushPromises();
    expect(input?.value).toBe('123');
  });

  test('emits model events for custom models support and syncing', async () => {
    const model = ref('');
    const InputComponent = defineComponent({
      props: {
        textVal: String,
      },
      setup() {
        const { value, errorMessage } = useField('field', undefined, {
          modelPropName: 'textVal',
        });

        return {
          value,
          errorMessage,
        };
      },
      template: `
        <input v-model="value" />
      `,
    });

    mountWithHoc({
      components: {
        InputComponent,
      },
      setup() {
        return {
          model,
        };
      },
      template: `
      <InputComponent v-model:textVal="model" />
    `,
    });

    const input = document.querySelector('input');

    setValue(input as any, '123');
    await flushPromises();
    expect(model.value).toBe('123');
    model.value = '321';
    await flushPromises();
    expect(input?.value).toBe('321');
  });

  // #3906
  test('only latest validation run messages are used', async () => {
    function validator(value: string | undefined) {
      if (!value) {
        return true;
      }

      if (value.toLowerCase().startsWith('b')) {
        return 'not b';
      }

      return new Promise<string | boolean>(resolve => {
        setTimeout(() => {
          if (value.toLowerCase().startsWith('a')) {
            resolve('not a');
            return;
          }

          resolve(true);
        }, 100);
      });
    }

    mountWithHoc({
      setup() {
        const { value, errorMessage } = useField<string>('field', validator);

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

    setValue(input as any, 'a');
    await flushPromises();
    setValue(input as any, 'b');
    await flushPromises();
    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(error?.textContent).toBe('not b');
  });
});
