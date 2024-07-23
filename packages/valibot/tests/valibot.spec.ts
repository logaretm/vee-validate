import { Ref, ref } from 'vue';
import * as v from 'valibot';
import { FieldMeta, useField, useForm } from '@/vee-validate';
import { toTypedSchema } from '@/valibot';
import { mountWithHoc, flushPromises, setValue } from '../../vee-validate/tests/helpers';

const REQUIRED_MSG = 'field is required';
const MIN_MSG = 'field is too short';
const EMAIL_MSG = 'field must be a valid email';

describe('valibot', () => {
  test('validates typed field with valibot', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = v.pipe(v.string(), v.minLength(1, REQUIRED_MSG), v.minLength(8, MIN_MSG));
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
        const schema = v.pipe(v.string(), v.minLength(1, REQUIRED_MSG), v.minLength(8, MIN_MSG));
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

  test('reports required state reactively', async () => {
    let meta!: FieldMeta<unknown>;
    const schema = ref(
      toTypedSchema(
        v.object({
          name: v.string(),
        }),
      ),
    );

    mountWithHoc({
      setup() {
        useForm({
          validationSchema: schema,
        });

        const field = useField('name');
        meta = field.meta;

        return {
          schema,
        };
      },
      template: `<div></div>`,
    });

    await flushPromises();
    await expect(meta.required).toBe(true);

    schema.value = toTypedSchema(v.object({ name: v.optional(v.string()) }));
    await flushPromises();
    await expect(meta.required).toBe(false);
  });

  test('shows multiple errors using error bag', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          v.object({
            email: v.pipe(v.string(), v.email(EMAIL_MSG), v.minLength(7, MIN_MSG)),
            password: v.pipe(v.string(), v.minLength(8, MIN_MSG)),
          }),
        );

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

  test('validates typed schema form with valibot', async () => {
    const wrapper = mountWithHoc({
      setup() {
        const schema = toTypedSchema(
          v.object({
            email: v.pipe(v.string(), v.email(EMAIL_MSG), v.minLength(1, MIN_MSG)),
            password: v.pipe(v.string(), v.minLength(8, MIN_MSG)),
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
          v.object({
            age: v.pipe(
              v.unknown(),
              v.transform(v => Number(v)),
            ),
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
          v.object({
            age: v.optional(v.number(), 11),
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
          v.object({
            name: v.optional(v.string(), 'test'),
            age: v.optional(v.number(), 11),
            unknownKey: v.optional(v.string()),
            object: v.optional(
              v.object({
                nestedKey: v.optional(v.string()),
                nestedDefault: v.optional(v.string(), 'nested'),
              }),
              {},
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
          v.object({
            age: v.pipe(
              v.unknown(),
              v.transform(arg => Number(arg)),
            ),
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
          v.object({
            email: v.pipe(v.string(), v.minLength(1)),
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

test('reports required state on fields', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        v.object({
          'not.nested.path': v.string(),
          name: v.optional(v.string()),
          email: v.string(),
          nested: v.object({
            arr: v.array(v.object({ req: v.string(), nreq: v.optional(v.string()) })),
            obj: v.object({
              req: v.string(),
              nreq: v.optional(v.string()),
            }),
          }),
        }),
      );

      useForm({
        validationSchema: schema,
      });

      const { meta: name } = useField('name');
      const { meta: email } = useField('email');
      const { meta: req } = useField('nested.obj.req');
      const { meta: nreq } = useField('nested.obj.nreq');
      const { meta: arrReq } = useField('nested.arr.0.req');
      const { meta: arrNreq } = useField('nested.arr.1.nreq');
      const { meta: notNested } = useField('[not.nested.path]');

      metaSpy({
        name: name.required,
        email: email.required,
        objReq: req.required,
        objNreq: nreq.required,
        arrReq: arrReq.required,
        arrNreq: arrNreq.required,
        notNested: notNested.required,
      });

      return {
        schema,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  await expect(metaSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      name: false,
      email: true,
      objReq: true,
      objNreq: false,
      arrReq: true,
      arrNreq: false,
      notNested: true,
    }),
  );
});

test('reports required false for non-existent fields', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        v.object({
          name: v.string(),
          nested: v.object({
            arr: v.array(v.object({ prop: v.string() })),
            obj: v.object({}),
          }),
        }),
      );

      useForm({
        validationSchema: schema,
      });

      const { meta: email } = useField('email');
      const { meta: req } = useField('nested.obj.req');
      const { meta: arrReq } = useField('nested.arr.0.req');

      metaSpy({
        email: email.required,
        objReq: req.required,
        arrReq: arrReq.required,
      });

      return {
        schema,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  await expect(metaSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      email: false,
      objReq: false,
      arrReq: false,
    }),
  );
});

test('reports required state for field-level schemas', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      useForm();
      const { meta: req } = useField('req', toTypedSchema(v.string()));
      const { meta: nreq } = useField('nreq', toTypedSchema(v.optional(v.string())));

      metaSpy({
        req: req.required,
        nreq: nreq.required,
      });

      return {};
    },
    template: `<div></div>`,
  });

  await flushPromises();
  await expect(metaSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      req: true,
      nreq: false,
    }),
  );
});

test('reports required state for field-level schemas without a form context', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      const { meta: req } = useField('req', toTypedSchema(v.string()));
      const { meta: nreq } = useField('nreq', toTypedSchema(v.optional(v.string())));

      metaSpy({
        req: req.required,
        nreq: nreq.required,
      });

      return {};
    },
    template: `<div></div>`,
  });

  await flushPromises();
  await expect(metaSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      req: true,
      nreq: false,
    }),
  );
});

test('allows passing valibot config', async () => {
  let errors!: Ref<string[]>;
  const wrapper = mountWithHoc({
    setup() {
      const schema = v.pipe(v.string(), v.minLength(1, REQUIRED_MSG), v.minLength(8, MIN_MSG));
      const rules = toTypedSchema(schema, { abortEarly: true });
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
