import { Ref } from 'vue';
import { useField, useForm } from '@/vee-validate';
import { string, minLength, email as emailV, object, coerce, any, number, withDefault, optional } from 'valibot';
import { toTypedSchema } from '@/valibot';
import { mountWithHoc, flushPromises, setValue } from '../../vee-validate/tests/helpers';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

describe('valibot', () => {
  test('validates typed field with valibot', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = string([minLength(1, REQUIRED_MSG), minLength(8, MIN_MSG)]);
        const rules = toTypedSchema(schema);
        const { value, errorMessage } = useField('test', rules);

        return {
          value,
          errorMessage,
        };
      },
      template: `
      <div>
          <input v-model="value" type="text">
          <p>{{ errorMessage }}</p>
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');
    const error = wrapper.$el.querySelector('p');

    setValue(input, '');
    await flushPromises();
    expect(error.textContent).toBe(REQUIRED_MSG);
    setValue(input, '12');
    await flushPromises();
    expect(error.textContent).toBe(MIN_MSG);
    setValue(input, '12345678');
    await flushPromises();
    expect(error.textContent).toBe('');
  });

  test('generates multiple errors for any given field', async () => {
    let errors!: Ref<string[]>;
    const wrapper = mountWithHoc({
      setup() {
        const schema = string([minLength(1, REQUIRED_MSG), minLength(8, MIN_MSG)]);
        const rules = toTypedSchema(schema);
        const { value, errors: fieldErrors } = useField('test', rules);

        errors = fieldErrors;
        return {
          value,
        };
      },
      template: `
      <div>
          <input v-model="value" type="text">
      </div>
    `,
    });

    const input = wrapper.$el.querySelector('input');

    setValue(input, '');
    await flushPromises();
    expect(errors.value).toHaveLength(2);
    expect(errors.value).toEqual([REQUIRED_MSG, MIN_MSG]);
  });

  test('shows multiple errors using error bag', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            email: string([emailV(EMAIL_MSG), minLength(7, MIN_MSG)]),
            password: string([minLength(8, MIN_MSG)]),
          }),
        );

        const { useFieldModel, errorBag } = useForm({
          validationSchema: schema,
          validateOnMount: true,
        });

        const [email, password] = useFieldModel(['email', 'password']);

        return {
          schema,
          email,
          password,
          errorBag,
        };
      },
      template: `
      <div>
        <input id="email" name="email" v-model="email" />
        <span id="emailErr">{{ errorBag.email?.join(',') }}</span>

        <input id="password" name="password" type="password" v-model="password" />
        <span id="passwordErr">{{ errorBag.password?.join(',') }}</span>
      </div>
    `,
    });

    const email = wrapper.$el.querySelector('#email');
    const password = wrapper.$el.querySelector('#password');
    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    await flushPromises();

    setValue(email, 'hello@');
    setValue(password, '1234');
    await flushPromises();

    expect(emailError.textContent).toBe([EMAIL_MSG, MIN_MSG].join(','));
    expect(passwordError.textContent).toBe([MIN_MSG].join(','));

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
  });

  test('validates typed schema form with valibot', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            email: string([emailV(EMAIL_MSG), minLength(1, MIN_MSG)]),
            password: string([minLength(8, MIN_MSG)]),
          }),
        );

        const { useFieldModel, errors } = useForm({
          validationSchema: schema,
          validateOnMount: true,
        });

        const [email, password] = useFieldModel(['email', 'password']);

        return {
          schema,
          email,
          password,
          errors,
        };
      },
      template: `
    <div>
      <input id="email" name="email" v-model="email" />
      <span id="emailErr">{{ errors.email }}</span>

      <input id="password" name="password" type="password" v-model="password" />
      <span id="passwordErr">{{ errors.password }}</span>
    </div>
    `,
    });

    const email = wrapper.$el.querySelector('#email');
    const password = wrapper.$el.querySelector('#password');
    const emailError = wrapper.$el.querySelector('#emailErr');
    const passwordError = wrapper.$el.querySelector('#passwordErr');

    await flushPromises();

    setValue(email, 'hello');
    setValue(password, '1234');
    await flushPromises();

    expect(emailError.textContent).toBe(EMAIL_MSG);
    expect(passwordError.textContent).toBe(MIN_MSG);

    setValue(email, 'hello@email.com');
    setValue(password, '12346789');
    await flushPromises();

    expect(emailError.textContent).toBe('');
    expect(passwordError.textContent).toBe('');
  });

  test('uses valibot for form values transformations and parsing', async () => {
    const submitSpy = vi.fn();
    mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            age: coerce(any(), v => Number(v)),
          }),
        );

        const { handleSubmit } = useForm({
          validationSchema: schema,
          initialValues: { age: '11' },
        });

        // submit now
        handleSubmit(submitSpy)();

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(submitSpy).toHaveBeenCalledTimes(1);
    await expect(submitSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        age: 11,
      }),
      expect.anything(),
    );
  });

  test('uses valibot default values for submission', async () => {
    const submitSpy = vi.fn();

    mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            age: withDefault(number(), 11),
          }),
        );

        const { handleSubmit } = useForm({
          validationSchema: schema,
        });

        // submit now
        handleSubmit(submitSpy)();

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(submitSpy).toHaveBeenCalledTimes(1);
    await expect(submitSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        age: 11,
      }),
      expect.anything(),
    );
  });

  test('uses valibot default values for initial values', async () => {
    const initialSpy = vi.fn();
    mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            name: withDefault(string(), 'test'),
            age: withDefault(number(), 11),
            unknownKey: optional(string()),
            object: withDefault(
              object({
                nestedKey: optional(string()),
                nestedDefault: withDefault(string(), 'nested'),
              }),
              {} as any,
            ),
          }),
        );

        const { values } = useForm({
          validationSchema: schema,
        });

        // submit now
        initialSpy(values);

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(initialSpy).toHaveBeenCalledTimes(1);
    await expect(initialSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        age: 11,
        name: 'test',
        object: {
          nestedDefault: 'nested',
        },
      }),
    );
  });

  test('reset form should cast the values', async () => {
    const valueSpy = vi.fn();
    mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            age: coerce(any(), arg => Number(arg)),
          }),
        );

        const { values, resetForm } = useForm({
          validationSchema: schema,
        });

        resetForm({ values: { age: '12' } });
        // submit now
        valueSpy(values);

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(valueSpy).toHaveBeenCalledTimes(1);
    await expect(valueSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        age: 12,
      }),
    );
  });

  // #4186
  test('default values should not be undefined', async () => {
    const initialSpy = vi.fn();
    mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          object({
            email: string([minLength(1)]),
          }),
        );

        const { values } = useForm({
          validationSchema: schema,
        });

        // submit now
        initialSpy(values);

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(initialSpy).toHaveBeenCalledTimes(1);
    await expect(initialSpy).toHaveBeenLastCalledWith(expect.objectContaining({}));
  });
});
