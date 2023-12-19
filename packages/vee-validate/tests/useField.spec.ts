import { FieldContext, FormContext, useField, useForm } from '@/vee-validate';
import { defineComponent, onMounted, ref } from 'vue';
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

  test.skip('warns when nested value changes', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    mountWithHoc({
      setup() {
        const { value, errorMessage } = useField<any>('field', undefined, {
          initialValue: { name: 'test' },
        });

        onMounted(() => {
          value.value.name = '';
        });

        return {
          value,
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
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
            val ? true : REQUIRED_MESSAGE,
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
            { bails: false },
          );
          const {
            value: value2,
            meta: meta2,
            errors: errors2,
            resetField: reset2,
          } = useField(
            'field',
            [val => ((val as string)?.length >= 3 ? true : MIN_MESSAGE), val => (val ? true : REQUIRED_MESSAGE)],
            { bails: false },
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
        const { value, errorMessage } = useField('field', undefined, { syncVModel: true });

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

  test('uses initial model value when sync v-model is set', async () => {
    const model = ref('test');
    const InputComponent = defineComponent({
      props: {
        modelValue: String,
      },
      setup() {
        const { value, errorMessage } = useField('field', undefined, { syncVModel: true });

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

    await flushPromises();
    expect(model.value).toBe('test');
    expect(input?.value).toBe('test');
  });

  // #4333
  test('should emit modified values with model modifiers being applied as a prop', async () => {
    const model = ref('');
    const InputComponent = defineComponent({
      props: {
        modelValue: String,
        modelModifiers: null,
      },
      setup() {
        const { value, errorMessage } = useField('field', undefined, { syncVModel: true });

        return {
          value,
          errorMessage,
        };
      },
      template: `
        <input v-model="value" />
      `,
    });

    const onModelUpdated = vi.fn();

    mountWithHoc({
      components: {
        InputComponent,
      },
      setup() {
        return {
          onModelUpdated,
          model,
        };
      },
      template: `
      <InputComponent :model-value="model" @update:model-value="onModelUpdated" :model-modifiers="{ number: true }" />
    `,
    });

    const input = document.querySelector('input');

    setValue(input as any, '123');
    await flushPromises();
    expect(onModelUpdated).toHaveBeenLastCalledWith(123);
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
          syncVModel: true,
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
    vi.advanceTimersByTime(200);
    await flushPromises();
    expect(error?.textContent).toBe('not b');
  });

  test('allows explicit forms to be provided via the form option', async () => {
    let form1!: FormContext;
    let form2!: FormContext;
    let field1!: FieldContext;
    let field2!: FieldContext;
    mountWithHoc({
      setup() {
        form1 = useForm();
        form2 = useForm();
        field1 = useField('field', undefined, {
          form: form1,
        });
        field2 = useField('field', undefined, {
          form: form2,
        });

        return {};
      },
      template: `
      <div></div>
    `,
    });

    await flushPromises();
    field1.value.value = '1';
    field2.value.value = '2';
    await flushPromises();

    expect(form1.values.field).toBe('1');
    expect(form2.values.field).toBe('2');
  });

  test('allows lazy name expressions', async () => {
    const nameRef = ref('first');
    mountWithHoc({
      setup() {
        const { name } = useField(() => nameRef.value);

        return {
          name,
        };
      },
      template: `
      <span>{{ name }}</span>
    `,
    });

    const name = document.querySelector('span');

    await flushPromises();
    expect(name?.textContent).toBe('first');
    nameRef.value = 'second';
    await flushPromises();
    expect(name?.textContent).toBe('second');
  });

  test('handle change validates the field by default', async () => {
    let field!: FieldContext;
    const validator = vi.fn(val => (val ? true : REQUIRED_MESSAGE));
    mountWithHoc({
      setup() {
        field = useField('field', validator);
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(validator).toHaveBeenCalledTimes(1);
    expect(field.errorMessage.value).toBe(undefined);
    field.handleChange('');
    await flushPromises();
    expect(field.errorMessage.value).toBe(REQUIRED_MESSAGE);
  });

  test('handle change can be configured to not validate the field', async () => {
    let field!: FieldContext;
    const validator = vi.fn(val => (val ? true : REQUIRED_MESSAGE));
    mountWithHoc({
      setup() {
        field = useField('field', validator, { validateOnValueUpdate: false });
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(validator).toHaveBeenCalledTimes(1);
    expect(field.errorMessage.value).toBe(undefined);
    field.handleChange('', false);
    await flushPromises();

    expect(validator).toHaveBeenCalledTimes(2);
    expect(field.errorMessage.value).toBe(undefined);
  });

  test('handleChange parses input[type=number] value', async () => {
    let field!: FieldContext;

    mountWithHoc({
      setup() {
        field = useField('field', undefined);
        const { handleChange } = field;

        return {
          handleChange,
        };
      },
      template: `<input type="number" @change="handleChange" />`,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    setValue(input, '123');
    await flushPromises();
    expect(field.value.value).toBe(123);

    setValue(input, '');
    await flushPromises();
    expect(field.value.value).toBe('');
  });

  test('handleChange parses input[type=range] value', async () => {
    let field!: FieldContext;

    mountWithHoc({
      setup() {
        field = useField('field', undefined);
        const { handleChange } = field;

        return {
          handleChange,
        };
      },
      template: `<input type="range" min="0" max="1000" step="100" @change="handleChange" />`,
    });

    await flushPromises();
    const input = document.querySelector('input') as HTMLInputElement;
    setValue(input, '500');
    await flushPromises();
    expect(field.value.value).toBe(500);

    setValue(input, '0');
    await flushPromises();
    expect(field.value.value).toBe(0);
  });

  test('a validator can return multiple messages', async () => {
    let field!: FieldContext;
    const validator = vi.fn(val => (val ? true : [REQUIRED_MESSAGE, 'second']));

    mountWithHoc({
      setup() {
        field = useField('field', validator);

        return {};
      },
    });

    await flushPromises();
    expect(field.errors.value).toHaveLength(0);
    await field.validate();
    await flushPromises();
    expect(field.errors.value).toHaveLength(2);
    expect(field.errors.value).toEqual([REQUIRED_MESSAGE, 'second']);
  });

  // #4323
  test('resetField should not validate', async () => {
    let field!: FieldContext;
    const validator = vi.fn(val => (val ? true : REQUIRED_MESSAGE));

    mountWithHoc({
      setup() {
        useForm();
        field = useField('field', validator);

        return {};
      },
    });

    await flushPromises();
    expect(field.errors.value).toHaveLength(0);
    field.resetField({ value: '' });
    await flushPromises();
    expect(field.errors.value).toHaveLength(0);
  });

  // #4603
  test('should not remove field value if field with same path was created between scheduling and execution of previous field unset operation', async () => {
    vi.useFakeTimers();
    let form!: FormContext;
    mountWithHoc({
      setup() {
        form = useForm();
        const toggle = ref(false);
        const value = ref('');

        onMounted(async () => {
          await new Promise(resolve => {
            setTimeout(() => resolve(null), 1000);
          });

          toggle.value = true;
          value.value = 'test';
        });
        return { form, toggle, value };
      },
      template: `
      <template v-if="!toggle">
        <CustomField name="field" :model-value="value" />
      </template>
      <template v-if="toggle">
        <CustomField name="field" :model-value="value" />
      </template>
      `,
      components: {
        CustomField: {
          props: {
            name: String,
            modelValue: String,
          },
          setup(props: any) {
            useField(props.name, undefined, {
              initialValue: props.modelValue,
            });
          },
          template: `<input type="text" :value="modelValue" :name="name" />`,
        },
      },
    });

    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(form.values.field).toEqual('test');
  });
});
