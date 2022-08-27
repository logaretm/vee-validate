import { FormContext, useField, useForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises, runInSetup } from './helpers';
import * as yup from 'yup';
import { Ref } from 'vue';

describe('useForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';

  test('sets individual field error message', async () => {
    mountWithHoc({
      setup() {
        const { setFieldError } = useForm();
        const { errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

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
    const spy = jest.spyOn(console, 'warn').mockImplementation();

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

  test('Creates a writeable model for a field path', async () => {
    await runInSetup(() => {
      const { values, useFieldModel } = useForm({
        initialValues: {
          greet: 'hey',
          age: 1,
        },
      });
      const greet = useFieldModel('greet');
      const age = useFieldModel('age');

      expect(values.greet).toBe('hey');
      expect(values.age).toBe(1);
      greet.value = 'hello';
      age.value = 2;
      expect(values.greet).toBe('hello');
      expect(values.age).toBe(2);
    });
  });

  test('Creates multiple writeable models for given field paths', async () => {
    await runInSetup(() => {
      const { values, useFieldModel } = useForm({
        initialValues: {
          greet: 'hey',
          age: 1,
        },
      });

      const [age, greet] = useFieldModel(['age', 'greet']);

      expect(values.greet).toBe('hey');
      expect(values.age).toBe(1);
      greet.value = 'hello';
      age.value = 2;
      expect(values.greet).toBe('hello');
      expect(values.age).toBe(2);
    });
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
        const { errors, useFieldModel } = useForm({
          validationSchema: {
            test: validator,
          },
        });
        const model = useFieldModel('test');

        return {
          model,
          errors,
        };
      },
      template: `
        <input name="field" v-model="model" />
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
    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(error?.textContent).toBe('not b');
  });
});
