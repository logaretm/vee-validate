import {
  FieldMeta,
  FormContext,
  FormMeta,
  useField,
  useForm,
  defineRule,
  configure,
  FieldContext,
} from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises, dispatchEvent } from './helpers';
import * as yup from 'yup';
import { onMounted, ref, Ref } from 'vue';
import { ModelComp, CustomModelComp } from './helpers/ModelComp';

describe('useForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';

  test('sets individual field error message', async () => {
    let fieldMeta!: FieldMeta<unknown>;
    mountWithHoc({
      setup() {
        const { setFieldError } = useForm({ initialValues: { field: 'test' } });
        const { errorMessage, meta } = useField('field', val => (val ? true : REQUIRED_MESSAGE));
        fieldMeta = meta;

        return {
          errorMessage,
          setFieldError,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
      <button @click="setFieldError('field', 'WRONG')">Set Field Error</button>
    `,
    });

    const error = document.querySelector('span');
    await flushPromises();
    expect(error?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(error?.textContent).toBe('WRONG');
    expect(fieldMeta.valid).toBe(false);
  });

  test('can clear individual field error messages', async () => {
    let setFieldError!: FormContext['setFieldError'];
    mountWithHoc({
      setup() {
        const form = useForm();
        setFieldError = form.setFieldError;
        const { errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          errorMessage,
          setFieldError,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    setFieldError('field', 'WRONG');
    await flushPromises();
    expect(error?.textContent).toBe('WRONG');
    setFieldError('field', undefined);
    await flushPromises();
    expect(error?.textContent).toBe('');
  });

  test('sets multiple field error messages', async () => {
    mountWithHoc({
      setup() {
        const { setErrors } = useForm();
        const { errorMessage: err1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { errorMessage: err2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          err1,
          err2,
          setErrors,
        };
      },
      template: `
      <span>{{ err1 }}</span>
      <span>{{ err2 }}</span>
      <button @click="setErrors({ field1: 'WRONG', field2: 'WRONG AGAIN', field3: 'huh' })">Set Field Error</button>
    `,
    });

    const errors = document.querySelectorAll('span');
    await flushPromises();
    expect(errors[0]?.textContent).toBe('');
    expect(errors[1]?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(errors[0]?.textContent).toBe('WRONG');
    expect(errors[1]?.textContent).toBe('WRONG AGAIN');
  });

  test('sets individual field touched meta', async () => {
    mountWithHoc({
      setup() {
        const { setFieldTouched, meta: formMeta } = useForm();
        const { meta } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta,
          formMeta,
          setFieldTouched,
        };
      },
      template: `
      <span id="field">{{ meta.touched }}</span>
      <span id="form">{{ formMeta.touched }}</span>
      <button @click="setFieldTouched('field', true)">Set Meta</button>
    `,
    });

    const fieldMeta = document.querySelector('#field');
    const formMeta = document.querySelector('#form');
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('false');
    expect(formMeta?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('true');
    expect(formMeta?.textContent).toBe('true');
  });

  test('sets multiple fields touched meta', async () => {
    mountWithHoc({
      setup() {
        const { setTouched, meta: formMeta } = useForm();
        const { meta: meta1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { meta: meta2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta1,
          meta2,
          formMeta,
          setTouched,
        };
      },
      template: `
      <span>{{ meta1.touched }}</span>
      <span>{{ meta2.touched }}</span>
      <span>{{ formMeta.touched }}</span>
      <button @click="setTouched({ field1: true, field2: false, field3: false })">Set Meta</button>
    `,
    });

    const meta = document.querySelectorAll('span');

    await flushPromises();
    expect(meta[0]?.textContent).toBe('false');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta[0]?.textContent).toBe('true');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('true');
  });

  // #4359
  test('setValues should validate by default', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm({ validationSchema: yup.object().shape({ field: yup.string().required(REQUIRED_MESSAGE) }) });
        form.defineField('field');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.errors.value.field).toBe(undefined);

    form.setValues({ field: '' });
    await flushPromises();
    expect(form.errors.value.field).toBe(REQUIRED_MESSAGE);
  });

  test('setValues should not validate if passed false as second arg', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm({ validationSchema: yup.object().shape({ field: yup.string().required(REQUIRED_MESSAGE) }) });
        form.defineField('field');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.errors.value.field).toBe(undefined);

    form.setValues({ field: '' }, false);
    await flushPromises();
    expect(form.errors.value.field).toBe(undefined);
  });

  test('has a validate() method that returns an aggregate of validation results using field rules', async () => {
    let validate: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validate = form.validate;
        useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const result = await validate();
    expect(result).toEqual({
      valid: false,
      errors: {
        field1: REQUIRED_MESSAGE,
        field2: REQUIRED_MESSAGE,
      },
      results: {
        field1: {
          valid: false,
          errors: [REQUIRED_MESSAGE],
        },
        field2: {
          valid: false,
          errors: [REQUIRED_MESSAGE],
        },
      },
    });
  });

  test('has a validate method that returns an aggregate of validation results using validation schema', async () => {
    let validate: any;
    mountWithHoc({
      setup() {
        const form = useForm({
          validationSchema: yup.object({
            field1: yup.string().required(REQUIRED_MESSAGE),
            field2: yup.string().required(REQUIRED_MESSAGE),
          }),
        });

        validate = form.validate;
        useField('field1');
        useField('field2');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const pending = validate();
    await flushPromises();
    const result = await pending;
    expect(result).toEqual({
      valid: false,
      errors: {
        field1: REQUIRED_MESSAGE,
        field2: REQUIRED_MESSAGE,
      },
      results: {
        field1: {
          valid: false,
          errors: [REQUIRED_MESSAGE],
        },
        field2: {
          valid: false,
          errors: [REQUIRED_MESSAGE],
        },
      },
    });
  });

  test('has a validateField() method that validates a specific field', async () => {
    let validateField: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validateField = form.validateField;
        const { errorMessage: f1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { errorMessage: f2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return { f1, f2 };
      },
      template: `<div>
        <span id="f1">{{ f1 }}</span>
        <span id="f2">{{ f2 }}</span>
      </div>`,
    });

    await flushPromises();
    const result = await validateField('field2');
    expect(result).toEqual({
      valid: false,
      errors: [REQUIRED_MESSAGE],
    });

    expect(document.querySelector('#f2')?.textContent).toBe(REQUIRED_MESSAGE);
    expect(document.querySelector('#f1')?.textContent).toBe('');
  });

  test('warns when validateField() is called on a non-existent field', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });

    let validateField: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validateField = form.validateField;

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const result = await validateField('field2');
    expect(result).toEqual({
      valid: true,
      errors: [],
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('hoists nested field errors to their parent if no field has it', async () => {
    let form!: FormContext;
    mountWithHoc({
      setup() {
        form = useForm({
          validationSchema: yup.object({
            name: yup.object({
              value: yup.string().required(REQUIRED_MESSAGE),
            }),
          }),
          validateOnMount: true,
        });

        useField('name');

        return {};
      },
      template: `
      <div></div>
    `,
    });

    await flushPromises();
    expect(form.errors.value.name).toBe(REQUIRED_MESSAGE);
    expect(form.meta.value.valid).toBe(false);
  });

  test('selects the deepest candidate for hoisted errors', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm({
          validationSchema: yup.object({
            names: yup.object({
              value: yup.array().of(yup.object({ name: yup.string().required(REQUIRED_MESSAGE) })),
            }),
          }),
          validateOnMount: true,
          initialValues: {
            names: {
              value: [{ name: '' }, { name: '' }, { name: '' }],
            },
          },
        });

        useField('names.value');
        useField('names');

        return {};
      },
      template: `
      <div></div>
    `,
    });

    await flushPromises();
    expect(form.errors.value.names).toBe(undefined);
    expect(form.errors.value['names.value']).toBe(REQUIRED_MESSAGE);
    expect(form.meta.value.valid).toBe(false);
  });

  test('resets the meta valid state on reset', async () => {
    let passwordValue!: Ref<string>;
    mountWithHoc({
      setup() {
        const { meta: formMeta, resetForm, errors } = useForm();
        const { value } = useField('field', val => (val ? true : REQUIRED_MESSAGE));
        const { value: pwValue } = useField<string>('password', val => (val ? true : REQUIRED_MESSAGE));
        passwordValue = pwValue;

        return {
          value,
          formMeta,
          resetForm,
          errors,
        };
      },
      template: `
      <input v-model="value" />
      <span id="meta">{{ formMeta.valid ? 'valid': 'invalid' }}</span>
      <span id="errors">{{ errors }}</span>
      <button @click="resetForm()">Reset Meta</button>
    `,
    });

    await flushPromises();
    const span = document.querySelector('#meta');
    const errors = document.querySelector('#errors');
    const input = document.querySelector('input') as HTMLInputElement;
    expect(span?.textContent).toBe('invalid');
    setValue(input, '12');
    await flushPromises();
    // still other field is invalid
    expect(span?.textContent).toBe('invalid');
    // but the error is silent so errors should be empty
    expect(errors?.textContent).toBe('{}');

    passwordValue.value = '12';
    await flushPromises();
    // now both should be valid
    expect(span?.textContent).toBe('valid');
    expect(errors?.textContent).toBe('{}');

    document.querySelector('button')?.click();
    await flushPromises();
    // validation was run again silently
    expect(span?.textContent).toBe('invalid');
    expect(errors?.textContent).toBe('{}');
  });

  test('resets the meta valid state on reset with the errors length', async () => {
    mountWithHoc({
      setup() {
        const { meta: formMeta, resetForm } = useForm();
        const { value } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          value,
          formMeta,
          resetForm,
        };
      },
      template: `
      <input v-model="value" />
      <span id="meta">{{ formMeta.valid ? 'valid': 'invalid' }}</span>
      <button @click="resetForm({ errors: { field: 'test' } })">Reset Meta</button>
    `,
    });

    await flushPromises();
    const span = document.querySelector('#meta');
    expect(span?.textContent).toBe('invalid');

    const input = document.querySelector('input') as HTMLInputElement;
    setValue(input, '12');
    await flushPromises();
    expect(span?.textContent).toBe('valid');

    document.querySelector('button')?.click();
    await flushPromises();
    expect(span?.textContent).toBe('invalid');
  });

  test('resets the meta dirty on reset', async () => {
    mountWithHoc({
      setup() {
        const { meta: formMeta, resetForm } = useForm();
        const { meta: meta1, value } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { meta: meta2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta1,
          meta2,
          formMeta,
          resetForm,
          value,
        };
      },
      template: `
      <input v-model="value">
      <span>{{ meta1.dirty }}</span>
      <span>{{ meta2.dirty }}</span>
      <span>{{ formMeta.dirty }}</span>
      <button @click="resetForm()">Reset</button>
    `,
    });

    const meta = document.querySelectorAll('span');
    const input = document.querySelector('input') as HTMLInputElement;

    await flushPromises();
    expect(meta[0]?.textContent).toBe('false');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('false');

    setValue(input, '1');
    await flushPromises();
    expect(meta[0]?.textContent).toBe('true');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('true');

    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta[0]?.textContent).toBe('false');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('false');
  });

  // #3906
  test('only latest schema validation run messages are used', async () => {
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
        const { errors, defineField } = useForm({
          validationSchema: {
            test: validator,
          },
        });

        const [model, props] = defineField('test');

        return {
          model,
          errors,
          props,
        };
      },
      template: `
        <input name="field" v-model="model" v-bind="props" />
        <span>{{ errors.test }}</span>
      `,
    });

    await flushPromises();

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

  // #3862
  test('exposes controlled only values', async () => {
    const spy = vi.fn();
    const initial = {
      field: '111',
      createdAt: Date.now(),
    };
    mountWithHoc({
      setup() {
        const { controlledValues, handleSubmit } = useForm({
          initialValues: initial,
        });

        const onSubmit = handleSubmit(values => {
          spy({ values, controlled: controlledValues.value });
        });

        useField('field');

        onMounted(onSubmit);

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        values: initial,
        controlled: { field: initial.field },
      }),
    );
  });

  // #3862
  test('exposes controlled only via submission handler withControlled', async () => {
    const spy = vi.fn();
    const initial = {
      field: '111',
      createdAt: Date.now(),
    };
    mountWithHoc({
      setup() {
        const { handleSubmit } = useForm({
          initialValues: initial,
        });

        const onSubmit = handleSubmit.withControlled(values => {
          spy({ values });
        });

        useField('field');

        onMounted(onSubmit);

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        values: { field: initial.field },
      }),
    );
  });

  // #3981 #3982
  test('fields validated meta should not be mutated when silently validating fields', async () => {
    let meta!: FieldMeta<any>;

    mountWithHoc({
      setup() {
        const { validate } = useForm({
          validationSchema: yup.object({
            name: yup.string().required(),
          }),
        });

        const field = useField('name');
        meta = field.meta;

        onMounted(() => {
          validate({ mode: 'silent' });
          validate({ mode: 'validated-only' });
        });

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(meta.validated).toBe(false);
  });

  // #4320
  test('Initial values are merged with previous values to ensure meta.dirty is stable', async () => {
    let meta!: Ref<FormMeta<any>>;

    mountWithHoc({
      setup() {
        const { resetForm, meta: fm } = useForm();
        useField('name');
        useField('email');

        meta = fm;

        onMounted(() => {
          resetForm({ values: { name: 'test' } });
        });

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(meta.value.dirty).toBe(false);
  });

  // #3991
  test('initial value should not be mutable if nested field model is used', async () => {
    let model!: Ref<{ name: string }>;
    let formMeta!: Ref<FormMeta<{ field: { name: string } }>>;
    let reset!: () => void;

    mountWithHoc({
      setup() {
        const { meta, resetForm } = useForm({
          initialValues: { field: { name: '1' } },
          validationSchema: yup.object({
            name: yup.string().required(),
          }),
        });

        const field = useField<{ name: string }>('field');
        model = field.value;
        formMeta = meta;
        reset = resetForm;

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(formMeta.value.initialValues?.field?.name).toBe('1');
    model.value.name = 'test';
    await flushPromises();
    expect(model.value).toEqual({ name: 'test' });
    expect(formMeta.value.initialValues?.field?.name).toBe('1');
    reset();
    await flushPromises();
    expect(model.value).toEqual({ name: '1' });
    expect(formMeta.value.initialValues?.field?.name).toBe('1');

    model.value.name = 'test';
    await flushPromises();
    expect(model.value).toEqual({ name: 'test' });
    expect(formMeta.value.initialValues?.field?.name).toBe('1');
  });

  describe('defineField', () => {
    test('creates bindable object to components', async () => {
      mountWithHoc({
        components: {
          ModelComp,
        },
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name');

          return { props, model, values, errors };
        },
        template: `
        <ModelComp v-model="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
        <span id="values">{{ values.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      const valuesEl = document.getElementById('values');
      setValue(document.querySelector('input') as any, '');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('name is a required field');
      setValue(document.querySelector('input') as any, '123');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      expect(valuesEl?.textContent).toBe('123');
    });

    test('can configure the validation events', async () => {
      mountWithHoc({
        components: {
          ModelComp,
        },
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', { validateOnModelUpdate: false });

          return { props, model, values, errors };
        },
        template: `
        <ModelComp v-model="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
        <span id="values">{{ values.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      const valuesEl = document.getElementById('values');
      const input = document.querySelector('input') as HTMLInputElement;
      setValue(input, '');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      dispatchEvent(input, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('name is a required field');
      setValue(input, '123');
      dispatchEvent(input, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      expect(valuesEl?.textContent).toBe('123');
    });

    test('can pass extra props', async () => {
      mountWithHoc({
        components: {
          ModelComp,
        },
        setup() {
          const { defineField } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', {
            validateOnModelUpdate: true,
            props: state => ({ test: state.valid ? 'valid' : 'invalid' }),
          });

          return { model, props };
        },
        template: `
        <ModelComp v-model="model" v-bind="props" />
      `,
      });

      await flushPromises();
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(document.body.innerHTML).toContain('invalid');
      setValue(document.querySelector('input') as any, '123');
      await flushPromises();
      expect(document.body.innerHTML).toContain('valid');
    });

    test('can have lazy config', async () => {
      mountWithHoc({
        components: {
          ModelComp,
        },
        setup() {
          const { defineField } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', state => ({
            props: { test: state.valid ? 'valid' : 'invalid' },
            validateOnModelUpdate: true,
          }));

          return { model, props };
        },
        template: `
        <ModelComp v-model="model" v-bind="props" />
      `,
      });

      await flushPromises();
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(document.body.innerHTML).toContain('invalid');
      setValue(document.querySelector('input') as any, '123');
      await flushPromises();
      expect(document.body.innerHTML).toContain('valid');
    });

    test('works with custom model', async () => {
      mountWithHoc({
        components: {
          CustomModelComp,
        },
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name');

          return { model, props, values, errors };
        },
        template: `
        <CustomModelComp v-model:value="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
        <span id="values">{{ values.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      const valuesEl = document.getElementById('values');
      setValue(document.querySelector('input') as any, '');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('name is a required field');
      setValue(document.querySelector('input') as any, '123');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      expect(valuesEl?.textContent).toBe('123');
    });

    test('creates bindable object to HTML inputs', async () => {
      mountWithHoc({
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name');

          return { model, props, values, errors };
        },
        template: `
        <input v-model="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
        <span id="values">{{ values.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      const valuesEl = document.getElementById('values');
      setValue(document.querySelector('input') as any, '');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('name is a required field');
      setValue(document.querySelector('input') as any, '123');
      dispatchEvent(document.querySelector('input') as any, 'blur');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      expect(valuesEl?.textContent).toBe('123');
    });

    test('can configure the validation events', async () => {
      mountWithHoc({
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', { validateOnInput: true });

          return { model, props, values, errors };
        },
        template: `
        <input v-model="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
        <span id="values">{{ values.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      const valuesEl = document.getElementById('values');
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(errorEl?.textContent).toBe('name is a required field');
      setValue(document.querySelector('input') as any, '123');
      await flushPromises();
      expect(errorEl?.textContent).toBe('');
      expect(valuesEl?.textContent).toBe('123');
    });

    test('can pass extra props', async () => {
      mountWithHoc({
        setup() {
          const { defineField } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', {
            validateOnInput: true,
            props: state => ({ 'aria-valid': state.valid ? 'true' : 'false' }),
          });

          return { model, props };
        },
        template: `
        <input v-model="model" v-bind="props" />
      `,
      });

      await flushPromises();
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(document.body.innerHTML).toContain('aria-valid="false"');
      setValue(document.querySelector('input') as any, '123');
      await flushPromises();
      expect(document.body.innerHTML).toContain('aria-valid="true"');
    });

    test('can have lazy config', async () => {
      mountWithHoc({
        components: {
          ModelComp,
        },
        setup() {
          const { defineField } = useForm({
            validationSchema: yup.object({
              name: yup.string().required(),
            }),
          });

          const [model, props] = defineField('name', state => ({
            props: { 'aria-valid': state.valid ? 'true' : 'false' },
            validateOnModelUpdate: true,
          }));

          return { model, props };
        },
        template: `
        <input v-model="model" v-bind="props" />
      `,
      });

      await flushPromises();
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(document.body.innerHTML).toContain('aria-valid="false"');
      setValue(document.querySelector('input') as any, '123');
      await flushPromises();
      expect(document.body.innerHTML).toContain('aria-valid="true"');
    });

    test('can specify a label', async () => {
      defineRule('required', (value: string) => {
        return !!value;
      });

      configure({
        generateMessage: ({ field }) => `${field} is bad`,
      });

      mountWithHoc({
        setup() {
          const { defineField, values, errors } = useForm({
            validationSchema: {
              name: 'required',
            },
          });

          const [model, props] = defineField('name', { validateOnInput: true, label: 'First Name' });

          return { model, props, values, errors };
        },
        template: `
        <input v-model="model" v-bind="props" />
        <span id="errors">{{ errors.name }}</span>
      `,
      });

      await flushPromises();
      const errorEl = document.getElementById('errors');
      setValue(document.querySelector('input') as any, '');
      await flushPromises();
      expect(errorEl?.textContent).toBe('First Name is bad');
    });
  });

  // #4341
  test('undefined field value should be the same as missing value when it comes to dirty', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: {
            fname: '',
          },
        });

        useField('fname');
        useField('lname');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.meta.value.dirty).toBe(false);
  });

  describe('error paths can have dot or square bracket for the same field', () => {
    test('path is bracket, mutations are dot', async () => {
      let field!: FieldContext<unknown>;
      let errorSetter!: FormContext['setFieldError'];
      mountWithHoc({
        setup() {
          const { setFieldError } = useForm();
          field = useField('users[0].test');
          errorSetter = setFieldError;
          return {};
        },
        template: `<div></div>`,
      });

      await flushPromises();
      expect(field.errorMessage.value).toBe(undefined);
      await flushPromises();
      errorSetter('users.0.test', 'error');
      await flushPromises();
      expect(field.errorMessage.value).toBe('error');
    });

    test('path is dot, mutations are bracket', async () => {
      let field!: FieldContext<unknown>;
      let errorSetter!: FormContext['setFieldError'];
      mountWithHoc({
        setup() {
          const { setFieldError } = useForm();
          field = useField('users.0.test');
          errorSetter = setFieldError;
          return {};
        },
        template: `<div></div>`,
      });

      await flushPromises();
      expect(field.errorMessage.value).toBe(undefined);
      await flushPromises();
      errorSetter('users[0].test', 'error');
      await flushPromises();
      expect(field.errorMessage.value).toBe('error');
    });
  });

  test('can query field touched state', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm();
        useField('fname');
        useField('nested.lname');
        useField('nested.fname');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.meta.value.touched).toBe(false);
    expect(form.isFieldTouched('fname')).toBe(false);
    expect(form.isFieldTouched('nested')).toBe(false);
    form.setFieldTouched('fname', true);
    form.setFieldTouched('nested.lname', true);
    await flushPromises();
    expect(form.meta.value.touched).toBe(true);
    expect(form.isFieldTouched('fname')).toBe(true);
    expect(form.isFieldTouched('nested')).toBe(true);
  });

  test('can query field dirty state', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm();
        useField('fname');
        useField('nested.lname');
        useField('nested.fname');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.meta.value.dirty).toBe(false);
    expect(form.isFieldDirty('fname')).toBe(false);
    expect(form.isFieldDirty('nested')).toBe(false);
    form.setFieldValue('fname', 'value');
    form.setFieldValue('nested.lname', 'value');
    await flushPromises();
    expect(form.meta.value.dirty).toBe(true);
    expect(form.isFieldDirty('fname')).toBe(true);
    expect(form.isFieldDirty('nested')).toBe(true);
  });

  test('can query field valid state', async () => {
    let form!: FormContext<any>;
    mountWithHoc({
      setup() {
        form = useForm();
        useField('fname');
        useField('nested.lname');
        useField('nested.fname');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    expect(form.meta.value.valid).toBe(true);
    expect(form.isFieldValid('fname')).toBe(true);
    expect(form.isFieldValid('nested')).toBe(true);
    form.setFieldError('fname', 'ERROR');
    form.setFieldError('nested.lname', 'ERROR');
    await flushPromises();
    expect(form.meta.value.valid).toBe(false);
    expect(form.isFieldValid('fname')).toBe(false);
    expect(form.isFieldValid('nested')).toBe(false);
  });

  // #4438
  test('silent validation should not mark a field as validated', async () => {
    let form!: FormContext<any>;
    const showFields = ref(false);
    mountWithHoc({
      setup() {
        form = useForm({
          validationSchema: yup.object({
            fname: yup.string().required(),
            lname: yup.string().required(),
          }),
        });

        return {
          showFields,
        };
      },
      template: `<div>
        <template v-if="showFields">
          <Field name="fname" />
          <Field name="lname" />
        </template>

      </div>`,
    });

    await flushPromises();
    showFields.value = true;
    await flushPromises();
    expect(form.errors.value.fname).toBe(undefined);
    expect(form.errors.value.lname).toBe(undefined);

    setValue(document.querySelector('input') as any, '123');
    await flushPromises();
    expect(form.errors.value.fname).toBe(undefined);
    expect(form.errors.value.lname).toBe(undefined);
  });

  test('values can be reset to specifically only include the provided fields', async () => {
    let form!: FormContext<{ fname: string; lname: string }>;

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { fname: '123', lname: '456' },
        });

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();

    form.resetForm({ values: { fname: 'test' } }, { force: true });
    expect(form.values.lname).toBeUndefined();
    expect(form.values.fname).toBe('test');
  });

  test('reset should not make unspecified values undefined', async () => {
    let form!: FormContext<{ fname: string; lname: string }>;

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { fname: '123', lname: '456' },
        });

        form.defineField('fname');
        form.defineField('lname');

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();

    form.resetForm({ values: { fname: 'test' } });
    expect(form.values.lname).toBe('456');
    expect(form.values.fname).toBe('test');
  });

  test('reset field should make the dirty state false', async () => {
    let form!: FormContext<{ fname: string; lname: string }>;

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { fname: '123', lname: '456' },
        });

        form.defineField('fname');
        form.defineField('lname');

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();

    form.resetField('fname', { value: 'test' });
    expect(form.meta.value.dirty).toBe(false);
  });

  test('defineField respects global model config', async () => {
    let form!: FormContext<{ fname: string; lname: string }>;
    let model!: Ref<string>;
    configure({
      validateOnModelUpdate: false,
    });

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { fname: '123', lname: '456' },
          validationSchema: yup.object({
            fname: yup.string().required(),
          }),
        });

        const field = form.defineField('fname');
        model = field[0];

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    model.value = '';
    await flushPromises();
    await expect(form.errors.value.fname).toBe(undefined);
  });

  test('checks if both source and target are POJO before setting properties', async () => {
    let form!: FormContext<{ file: { name: string; size: number } }>;
    const f1 = new File([''], 'f1.text');
    const f2 = { name: 'f2.text', size: 123 };

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { file: f1 },
        });

        form.defineField('file');

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();
    expect(form.values.file).toBeInstanceOf(File);
    expect(form.values.file).toBe(f1);
    form.setValues({ file: f2 });
    expect(form.values.file).toEqual(f2);
  });
});
