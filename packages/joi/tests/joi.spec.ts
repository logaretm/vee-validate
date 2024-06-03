import { useField, useForm } from '@/vee-validate';
import { toTypedSchema } from '@/joi';
import Joi from 'joi';
import { mountWithHoc, flushPromises, setValue } from '../../vee-validate/tests/helpers';
import { Ref } from 'vue';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

test('validates typed field with joi', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const joiSchema = Joi.string()
        .min(1)
        .rule({ keep: true, message: REQUIRED_MSG })
        .min(8)
        .rule({ keep: true, message: MIN_MSG })
        .messages({
          'string.empty': REQUIRED_MSG,
        });

      const rules = toTypedSchema(joiSchema);

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
      const joiSchema = Joi.string()
        .min(2)
        .rule({ keep: true, message: REQUIRED_MSG })
        .min(8)
        .rule({ keep: true, message: MIN_MSG })
        .messages({ 'string.empty': REQUIRED_MSG });

      const rules = toTypedSchema(joiSchema);
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

  setValue(input, '4');
  await flushPromises();
  expect(errors.value).toHaveLength(2);
  expect(errors.value).toEqual([REQUIRED_MSG, MIN_MSG]);
});

test('shows multiple errors using error bag', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const joiSchema = Joi.object({
        email: Joi.string()
          .email()
          .rule({ keep: true, message: EMAIL_MSG })
          .min(7)
          .rule({ keep: true, message: MIN_MSG }),
        password: Joi.string().min(8).message(MIN_MSG),
      });

      const schema = toTypedSchema(joiSchema);

      const { defineField, errorBag } = useForm({
        validationSchema: schema,
        validateOnMount: true,
      });

      const [email] = defineField('email', { validateOnModelUpdate: true });
      const [password] = defineField('password', { validateOnModelUpdate: true });

      return {
        schema,
        email,
        password,
        errorBag,
      };
    },
    template: `
      <div>
        <input id="email" name="email" v-model="email"  />
        <span id="emailErr">{{ errorBag.email?.join(',') }}</span>

        <input id="password" name="password" type="password" v-model="password"  />
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

test('validates typed schema form with joi', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        Joi.object({
          email: Joi.string()
            .email()
            .rule({ keep: true, message: EMAIL_MSG })
            .min(1)
            .rule({ keep: true, message: REQUIRED_MSG }),
          password: Joi.string().min(8).rule({ keep: true, message: MIN_MSG }),
        }),
      );

      const { defineField, errors } = useForm({
        validationSchema: schema,
        validateOnMount: true,
      });

      const [email] = defineField('email', { validateOnModelUpdate: true });
      const [password] = defineField('password', { validateOnModelUpdate: true });

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

  setValue(email, 'hello@');
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

test('uses joi default values for submission', async () => {
  const submitSpy = vi.fn();

  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        Joi.object({
          age: Joi.number().default(11),
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
  expect(submitSpy).toHaveBeenCalledTimes(1);
  expect(submitSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      age: 11,
    }),
    expect.anything(),
  );
});

test('uses joi default values for initial values', async () => {
  const initialSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        Joi.object({
          name: Joi.string().default('test'),
          age: Joi.number().default(11),
          unknownKey: Joi.string(),
          object: Joi.object({
            nestedKey: Joi.string(),
            nestedDefault: Joi.string().default('nested'),
          }).default(),
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
  expect(initialSpy).toHaveBeenCalledTimes(1);
  expect(initialSpy).toHaveBeenLastCalledWith(
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
        Joi.object({
          age: Joi.number(),
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
  expect(valueSpy).toHaveBeenCalledTimes(1);
  expect(valueSpy).toHaveBeenLastCalledWith(
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
        Joi.object({
          email: Joi.string().min(1),
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
  expect(initialSpy).toHaveBeenCalledTimes(1);
  expect(initialSpy).toHaveBeenLastCalledWith(expect.objectContaining({}));
});
