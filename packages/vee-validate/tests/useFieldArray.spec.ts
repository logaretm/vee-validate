import { useForm, useFieldArray, FieldEntry, FormContext, FieldArrayContext, useField } from '@/vee-validate';
import { defineComponent, nextTick, onMounted, Ref } from 'vue';
import * as yup from 'yup';
import { mountWithHoc, flushPromises, setValue } from './helpers';

test('can update a field entry model directly', async () => {
  mountWithHoc({
    setup() {
      useForm({
        initialValues: {
          users: ['1'],
        },
      });

      const { fields } = useFieldArray('users');
      onMounted(() => {
        const item = fields.value[0];
        item.value = 'test';
      });

      return {
        fields,
      };
    },
    template: `
      <p>{{ fields[0].value }}</p>
    `,
  });

  await flushPromises();
  expect(document.querySelector('p')?.innerHTML).toBe('test');
});

test('can update a field entry deep model directly and validate it', async () => {
  let fields!: Ref<FieldEntry<{ name: string }>[]>;
  mountWithHoc({
    setup() {
      const { errors } = useForm({
        validateOnMount: true,
        validationSchema: yup.object({
          users: yup.array().of(
            yup.object({
              name: yup.string().required(),
            }),
          ),
        }),
        initialValues: {
          users: [{ name: '' }],
        },
      });

      fields = useFieldArray<{ name: string }>('users').fields;

      return {
        fields,
        errors,
      };
    },
    template: `
      <p>{{ fields[0].value.name }}</p>
      <span>{{ errors }}</span>
    `,
  });

  await flushPromises();
  expect(document.querySelector('p')?.innerHTML).toBe('');
  expect(document.querySelector('span')?.innerHTML).toBeTruthy();

  const item = fields.value[0];
  item.value.name = 'test';

  await flushPromises();
  expect(document.querySelector('p')?.innerHTML).toBe('test');
  expect(document.querySelector('span')?.innerHTML).toBe('{}');
});

test('warns when updating a no-longer existing item', async () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
    // NOOP
  });
  mountWithHoc({
    setup() {
      useForm({
        initialValues: {
          users: ['1'],
        },
      });

      const { remove, fields } = useFieldArray('users');
      onMounted(async () => {
        const item = fields.value[0];
        remove(0);
        await nextTick();
        item.value = 'test';
      });
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();

  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('warns when no form context is present', async () => {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
    // NOOP
  });
  mountWithHoc({
    setup() {
      const { push } = useFieldArray('users');
      push('');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();

  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('duplicate calls yields the same instance', async () => {
  let removeFn!: (idx: number) => void;
  mountWithHoc({
    setup() {
      useForm({
        initialValues: {
          users: ['one'],
        },
      });

      const { fields, push } = useFieldArray('users');
      const { fields: fields2, remove } = useFieldArray('users');

      removeFn = remove;

      onMounted(() => {
        push('two');
      });

      return {
        fields,
        fields2,
      };
    },
    template: `
      <p id="arr1">{{ fields.map(f => f.value).join(', ') }}</p>
      <p id="arr2">{{ fields2.map(f => f.value).join(', ') }}</p>
    `,
  });

  await flushPromises();
  expect(document.querySelector('#arr1')?.innerHTML).toBe('one, two');
  expect(document.querySelector('#arr2')?.innerHTML).toBe('one, two');
  removeFn(0);
  await flushPromises();
  expect(document.querySelector('#arr1')?.innerHTML).toBe('two');
  expect(document.querySelector('#arr2')?.innerHTML).toBe('two');
});

// #4096
test('array push should trigger a silent validation', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: ['one'],
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  arr.push('');
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
});

test('array push noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.push('');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

// #4096
test('array prepend should trigger a silent validation', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: ['one'],
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  arr.prepend('');
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
});

test('array prepend noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.prepend('');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

// #4096
test('array insert should trigger a silent validation', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: ['one', 'two'],
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  arr.insert(1, '');
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
});

test('array insert noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.insert(0, '');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

test('array move noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.move(0, 1);
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

test('array swap noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.swap(0, 1);
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

test('array remove noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.remove(0);
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

test('array update noop when path is not an array', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: 'test',
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.update(0, '');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

test('array push initializes the array if undefined', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: undefined,
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.push('');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(1);
});

test('array prepend initializes the array if undefined', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: undefined,
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.prepend('');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(1);
});

test('array move initializes the array if undefined', async () => {
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      useForm<any>({
        initialValues: {
          users: undefined,
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
  arr.move(0, 0);
  await flushPromises();
  expect(arr.fields.value).toHaveLength(0);
});

// #4557
test('errors are available to the newly inserted items', async () => {
  let arr!: FieldArrayContext;
  const InputText = defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { value, errorMessage } = useField(() => props.name);

      return {
        value,
        errorMessage,
      };
    },
    template: '<input v-model="value" /> <span>{{errorMessage}}</span>',
  });

  mountWithHoc({
    components: { InputText },
    setup() {
      useForm<any>({
        initialValues: {
          users: ['one', 'three'],
        },
        validationSchema: yup.object({
          users: yup.array().of(yup.string().required().min(1)),
        }),
      });

      arr = useFieldArray('users');

      return {
        fields: arr.fields,
      };
    },
    template: `
      <div>
        <InputText v-for="(field, idx) in fields" :key="field.key" :name="'users[' + idx + ']'"  />
      </div>
    `,
  });
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const spanAt = (idx: number) => (document.querySelectorAll('span') || [])[idx] as HTMLSpanElement;
  await flushPromises();
  expect(arr.fields.value).toHaveLength(2);
  arr.insert(1, '');
  await flushPromises();
  expect(arr.fields.value).toHaveLength(3);
  setValue(inputAt(1), '');
  await flushPromises();
  expect(spanAt(1).textContent).toBeTruthy();
});
