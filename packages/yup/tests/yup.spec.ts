import { Ref } from 'vue';
import { useField, useForm } from '@/vee-validate';
import { toTypedSchema } from '@/yup';
import { mountWithHoc, flushPromises, setValue } from 'vee-validate/tests/helpers';
import * as yup from 'yup';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

test('validates typed field with yup', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const rules = toTypedSchema(yup.string().required(REQUIRED_MSG).min(8, MIN_MSG));
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

test('generates multiple errors when configured to not abort early', async () => {
  let errors!: Ref<string[]>;
  const wrapper = mountWithHoc({
    setup() {
      const rules = toTypedSchema(yup.string().required(REQUIRED_MSG).min(8, MIN_MSG), { abortEarly: false });
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

test('generates a single error when configured to abort early', async () => {
  let errors!: Ref<string[]>;
  const wrapper = mountWithHoc({
    setup() {
      const rules = toTypedSchema(yup.string().required(REQUIRED_MSG).min(8, MIN_MSG), { abortEarly: true });
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
  expect(errors.value).toHaveLength(1);
  expect(errors.value).toEqual([REQUIRED_MSG]);
});

test('validates typed schema form with yup', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          email: yup.string().email(EMAIL_MSG).required(),
          password: yup.string().min(8, MIN_MSG),
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

test('shows multiple errors using error bag', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          email: yup.string().email(EMAIL_MSG).min(7, MIN_MSG),
          password: yup.string().min(8, MIN_MSG),
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

test('uses yup for form values transformations and parsing', async () => {
  const submitSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          age: yup.number().transform(val => Number(val)),
        }),
      );

      const { handleSubmit } = useForm({
        validationSchema: schema,
        initialValues: { age: '11' as any },
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

test('uses yup default values for submitted values', async () => {
  const submitSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          age: yup.number().default(11),
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

test('uses yup default values for initial values', async () => {
  const initialSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          name: yup.string().required().default('test'),
          age: yup.number().default(11),
          unknownKey: yup.string(),
          object: yup.object({
            nestedKey: yup.string(),
            nestedDefault: yup.string().default('nested'),
          }),
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
