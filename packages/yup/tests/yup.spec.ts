import { Ref, ref } from 'vue';
import { FieldMeta, useField, useForm } from '@/vee-validate';
import { toTypedSchema } from '@/yup';
import { mountWithHoc, flushPromises, setValue } from '../../vee-validate/tests/helpers';
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

test('shows multiple errors using error bag', async () => {
  const wrapper = mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          email: yup.string().email(EMAIL_MSG).min(7, MIN_MSG),
          password: yup.string().min(8, MIN_MSG),
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

test('reports required state on fields', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          'not.nested.req': yup.string().required(),
          name: yup.string(),
          num: yup.number().required(),
          email: yup.string().required(),
          nested: yup.object({
            arr: yup.array().of(yup.object({ req: yup.string().required(), nreq: yup.string() })),
            obj: yup.object({
              req: yup.string().required(),
              nreq: yup.string(),
            }),
          }),
          tuple: yup.tuple([yup.string().required(), yup.string()]),
        }),
      );

      useForm({
        validationSchema: schema,
      });

      const { meta: name } = useField('name');
      const { meta: num } = useField('num');
      const { meta: email } = useField('email');
      const { meta: req } = useField('nested.obj.req');
      const { meta: nreq } = useField('nested.obj.nreq');
      const { meta: arrReq } = useField('nested.arr.0.req');
      const { meta: arrNreq } = useField('nested.arr.1.nreq');
      const { meta: nonNested } = useField('[not.nested.req]');
      const { meta: tupleReq } = useField('tuple.0');
      const { meta: tupleNreq } = useField('tuple.1');

      metaSpy({
        name: name.required,
        num: num.required,
        email: email.required,
        objReq: req.required,
        objNreq: nreq.required,
        arrReq: arrReq.required,
        arrNreq: arrNreq.required,
        nonNested: nonNested.required,
        tupleReq: tupleReq.required,
        tupleNreq: tupleNreq.required,
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
      num: true,
      objReq: true,
      objNreq: false,
      arrReq: true,
      arrNreq: false,
      nonNested: true,
      tupleReq: true,
      tupleNreq: false,
    }),
  );
});

test('reports required state reactively', async () => {
  let meta!: FieldMeta<any>;
  const schema = ref(
    toTypedSchema(
      yup.object({
        name: yup.string().required(),
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

  schema.value = toTypedSchema(yup.object({ name: yup.string() }));
  await flushPromises();
  await expect(meta.required).toBe(false);
});

test('reports single field required state reactively', async () => {
  let meta!: FieldMeta<any>;
  const schema = ref(toTypedSchema(yup.string().required()));
  mountWithHoc({
    setup() {
      const field = useField('name', schema);
      meta = field.meta;

      return {
        schema,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  await expect(meta.required).toBe(true);

  schema.value = toTypedSchema(yup.string());
  await flushPromises();
  await expect(meta.required).toBe(false);
});

test('reports required false for non-existent fields', async () => {
  const metaSpy = vi.fn();
  mountWithHoc({
    setup() {
      const schema = toTypedSchema(
        yup.object({
          name: yup.string(),
          nested: yup.object({
            arr: yup.array().of(yup.object({ prop: yup.string().required() })),
            obj: yup.object({
              req: yup.string().required(),
            }),
          }),
        }),
      );

      useForm({
        validationSchema: schema,
      });

      const { meta: email } = useField('email');
      const { meta: req } = useField('nested.req');
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
      const { meta: req } = useField('req', toTypedSchema(yup.string().required()));
      const { meta: nreq } = useField('nreq', toTypedSchema(yup.string()));

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
      const { meta: req } = useField('req', toTypedSchema(yup.string().required()));
      const { meta: nreq } = useField('nreq', toTypedSchema(yup.string()));

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

test('uses transformed value as submitted value', async () => {
  const onSubmitSpy = vi.fn();
  let onSubmit!: () => void;

  const wrapper = mountWithHoc({
    setup() {
      const { handleSubmit } = useForm<{
        req: string;
      }>();

      const { value } = useField('test', toTypedSchema(yup.string().transform(val => `modified: ${val}`)));

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

test('supports yup.strip', async () => {
  const onSubmitSpy = vi.fn();
  let onSubmit!: () => void;

  const wrapper = mountWithHoc({
    setup() {
      const { handleSubmit } = useForm({
        validationSchema: toTypedSchema(
          yup.object({
            test: yup.string().strip(),
            name: yup.string(),
          }),
        ),
      });

      const { value: test } = useField('test');
      const { value: name } = useField('name');

      // submit now
      onSubmit = handleSubmit(onSubmitSpy);

      return { test, name };
    },
    template: `
      <div>
        <input id="test" v-model="test" type="text">
        <input id="name" v-model="name" type="text">
      </div>
    `,
  });

  await flushPromises();

  const test = wrapper.$el.querySelector('#test');
  const name = wrapper.$el.querySelector('#name');

  setValue(test, '12345678');
  setValue(name, '12345678');
  await flushPromises();
  onSubmit();
  await flushPromises();
  await expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  await expect(onSubmitSpy).toHaveBeenLastCalledWith(
    expect.not.objectContaining({
      test: expect.anything(),
    }),
    expect.anything(),
  );
});
