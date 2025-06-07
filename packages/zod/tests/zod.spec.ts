import { useField, useForm } from '@/vee-validate';
import { mountWithHoc, flushPromises, setValue } from '../../vee-validate/tests/helpers';
import { Ref } from 'vue';
import { z } from 'zod';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

test('validates typed field with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const rules = z.string().min(1, REQUIRED_MSG).min(8, MIN_MSG);
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
      const rules = z.string().min(1, REQUIRED_MSG).min(8, MIN_MSG);
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
      const schema = z.object({
        email: z.string().email(EMAIL_MSG).min(7, MIN_MSG),
        password: z.string().min(8, MIN_MSG),
      });

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

test('validates typed schema form with zod', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = z.object({
        email: z.string().email(EMAIL_MSG).min(1, REQUIRED_MSG),
        password: z.string().min(8, MIN_MSG),
      });

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

// #4204
test('handles zod union errors', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = z.object({
        email: z.string().email({ message: 'valid email' }).min(1, 'Email is required'),
        name: z.string().min(1, 'Name is required'),
      });

      const schemaBothUndefined = z.object({
        email: z.undefined(),
        name: z.undefined(),
      });

      const bothOrNeither = z.object({ inner: schema.or(schemaBothUndefined) });

      const { defineField, errors } = useForm({
        validationSchema: bothOrNeither,
      });

      const [email] = defineField('inner.email', { validateOnModelUpdate: true });
      const [name] = defineField('inner.name', { validateOnModelUpdate: true });

      return {
        schema,
        email,
        name,
        errors,
      };
    },
    template: `
    <div>
      <span id="innerErr">{{ errors.inner }}</span>

      <input id="email" name="email" v-model="email" />
      <span id="emailErr">{{ errors.email }}</span>

      <input id="name" name="name" v-model="name" />
      <span id="nameErr">{{ errors.name }}</span>
    </div>
    `,
  });

  const email = wrapper.$el.querySelector('#email');
  const name = wrapper.$el.querySelector('#name');
  const emailError = wrapper.$el.querySelector('#emailErr');
  const nameError = wrapper.$el.querySelector('#nameErr');
  const innerError = wrapper.$el.querySelector('#innerErr');

  await flushPromises();

  setValue(name, '4');
  await flushPromises();
  expect(innerError.textContent).toBe('Invalid input');

  setValue(email, 'test@gmail.com');
  await flushPromises();

  expect(emailError.textContent).toBe('');
  expect(nameError.textContent).toBe('');
});

test('uses zod for form values transformations and parsing', async () => {
  const submitSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = z.object({
        age: z.preprocess(arg => Number(arg), z.number()),
      });

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

test('uses zod default values for submission', async () => {
  const submitSpy = vi.fn();

  mountWithHoc({
    setup() {
      const schema = z.object({
        age: z.number().default(11),
      });

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

// test('uses zod default values for initial values', async () => {
//   const initialSpy = vi.fn();
//   mountWithHoc({
//     setup() {
//       const schema = (
//         z.object({
//           name: z.string().default('test'),
//           age: z.number().default(11),
//           unknownKey: z.string(),
//           object: z.object({
//             nestedKey: z.string(),
//             nestedDefault: z.string().default('nested'),
//           }),
//         }),
//       );

//       const { values } = useForm({
//         validationSchema: schema,
//       });

//       // submit now
//       initialSpy(values);

//       return {
//         schema,
//       };
//     },
//     template: `<div></div>`,
//   });

//   await flushPromises();
//   await expect(initialSpy).toHaveBeenCalledTimes(1);
//   await expect(initialSpy).toHaveBeenLastCalledWith(
//     expect.objectContaining({
//       age: 11,
//       name: 'test',
//       object: {
//         nestedDefault: 'nested',
//       },
//     }),
//   );
// });

test('uses zod transforms values for submitted values', async () => {
  const onSubmitSpy = vi.fn();
  let onSubmit!: () => void;
  let model!: Ref<string | undefined>;
  mountWithHoc({
    setup() {
      const schema = z
        .object({
          random: z.string().min(3),
        })
        .transform(() => {
          return {
            random: 'modified',
          };
        });

      const { handleSubmit, defineField } = useForm({
        validationSchema: schema,
      });

      model = defineField('random')[0];

      // submit now
      onSubmit = handleSubmit(onSubmitSpy);

      return {
        schema,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  model.value = 'test';
  onSubmit();
  await flushPromises();
  await expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  await expect(onSubmitSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      random: 'modified',
    }),
    expect.anything(),
  );
});

// test('reset form should cast the values', async () => {
//   const valueSpy = vi.fn();
//   mountWithHoc({
//     setup() {
//       const schema = (
//         z.object({
//           age: z.preprocess(arg => Number(arg), z.number()),
//         }),
//       );

//       const { values, resetForm } = useForm({
//         validationSchema: schema,
//       });

//       resetForm({ values: { age: '12' } });
//       // submit now
//       valueSpy(values);

//       return {
//         schema,
//       };
//     },
//     template: `<div></div>`,
//   });

//   await flushPromises();
//   await expect(valueSpy).toHaveBeenCalledTimes(1);
//   await expect(valueSpy).toHaveBeenLastCalledWith(
//     expect.objectContaining({
//       age: 12,
//     }),
//   );
// });

// #4186
test('default values should not be undefined', async () => {
  const initialSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = z.object({
        email: z.string().min(1),
      });

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

test('uses transformed value as submitted value', async () => {
  const onSubmitSpy = vi.fn();
  let onSubmit!: () => void;

  const wrapper = mountWithHoc({
    setup() {
      const { handleSubmit } = useForm<{
        test: string;
      }>();

      const testRules = z.string().transform(value => `modified: ${value}`);
      const { value } = useField('test', testRules);

      // submit now
      onSubmit = handleSubmit(onSubmitSpy);

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

  setValue(input, '12345678');
  await flushPromises();
  onSubmit();
  await flushPromises();
  await expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  await expect(onSubmitSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      test: 'modified: 12345678',
    }),
    expect.anything(),
  );
});
