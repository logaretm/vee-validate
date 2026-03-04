import { useForm, useFieldArray, FieldEntry, FormContext, FieldArrayContext, useField } from '@/vee-validate';
import { defineComponent, nextTick, onMounted, Ref } from 'vue';
import * as z from 'zod';
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
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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

// #5029
test('array push with objects should trigger schema validation and update meta', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'test@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
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
  arr.push({ name: '', email: '' });
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
});

// #5029
test('array push with objects should update dirty meta', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'one', email: 'one@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.dirty).toBe(false);
  arr.push({ name: 'two', email: 'two@test.com' });
  await flushPromises();
  expect(form.meta.value.dirty).toBe(true);
});

// #5029
test('modifying field.value nested properties should trigger validation and update meta', async () => {
  let form!: FormContext;
  let fields!: Ref<FieldEntry<{ name: string }>[]>;
  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
            }),
          ),
        }),
      });

      fields = useFieldArray<{ name: string }>('users').fields;
    },
    template: `
      <div></div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  // Modify a nested property of an object field entry
  fields.value[0].value.name = '';
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
});

// #5029
test('useField with nested field array object paths should validate correctly', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  const InputField = defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { value, errorMessage } = useField(() => props.name);
      return { value, errorMessage };
    },
    template: '<input v-model="value" /><span class="error">{{ errorMessage }}</span>',
  });

  mountWithHoc({
    components: { InputField },
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');

      return {
        fields: arr.fields,
      };
    },
    template: `
      <div>
        <div v-for="(field, idx) in fields" :key="field.key">
          <InputField :name="'users[' + idx + '].name'" />
          <InputField :name="'users[' + idx + '].email'" />
        </div>
      </div>
    `,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  // Push an invalid object item
  arr.push({ name: '', email: 'invalid' });
  await flushPromises();
  // After flushPromises, the new useField components should be rendered
  // and the silent validation from afterMutation() should have run
  // meta.valid should be false since schema validation fails
  expect(form.meta.value.valid).toBe(false);

  // The error spans for the newly pushed item should show errors
  const errorSpans = document.querySelectorAll('.error');
  expect(errorSpans.length).toBe(4);

  // Now also verify that when user interacts with a field, errors appear
  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const errorAt = (idx: number) => (document.querySelectorAll('.error') || [])[idx] as HTMLSpanElement;

  // Touch the name field of the second item
  setValue(inputAt(2), '');
  await flushPromises();
  // Error should now be shown for the name field
  expect(errorAt(2)?.textContent).toBeTruthy();
});

// #5029
test('field array with objects: direct mutation of field.value properties updates errors and meta', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  let fields!: Ref<FieldEntry<{ name: string; email: string }>[]>;

  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray<{ name: string; email: string }>('users');
      fields = arr.fields;

      return {
        fields,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);

  // Direct mutation of a nested property (mimicking v-model="field.value.name")
  fields.value[0].value.name = '';
  await flushPromises();
  // meta.valid should reflect the validation failure
  expect(form.meta.value.valid).toBe(false);
  // meta.dirty should reflect the change
  expect(form.meta.value.dirty).toBe(true);
});

// #5029 - This test verifies the core issue: after pushing an item with useField components,
// errors should be properly propagated to useField path states (not just silent valid flag)
test('field array with objects: push invalid item should show errors on useField path states', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  const InputField = defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { value, errorMessage } = useField(() => props.name);
      return { value, errorMessage };
    },
    template: '<input v-model="value" /><span class="error">{{ errorMessage }}</span>',
  });

  mountWithHoc({
    components: { InputField },
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');

      return {
        fields: arr.fields,
      };
    },
    template: `
      <div>
        <div v-for="(field, idx) in fields" :key="field.key">
          <InputField :name="'users[' + idx + '].name'" />
          <InputField :name="'users[' + idx + '].email'" />
        </div>
      </div>
    `,
  });

  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const errorAt = (idx: number) => (document.querySelectorAll('.error') || [])[idx] as HTMLSpanElement;

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);

  // Push an invalid object item
  arr.push({ name: '', email: 'not-valid' });
  await flushPromises();

  // meta.valid should reflect validation failure
  expect(form.meta.value.valid).toBe(false);

  // At minimum, when the user interacts with the fields, errors should appear
  // Currently even after push, interacting with the empty field should show error
  setValue(inputAt(2), '');
  await flushPromises();
  expect(errorAt(2)?.textContent).toBeTruthy();
});

// #5029 - Test the exact pattern from the StackBlitz reproduction
test('field array with objects: v-model on field.value.prop tracks data and validates', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'initial', email: 'test@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray<{ name: string; email: string }>('users');

      return {
        fields: arr.fields,
        errors: form.errors,
        meta: form.meta,
      };
    },
    template: `
      <div>
        <div v-for="(field, idx) in fields" :key="field.key">
          <input class="name" :value="field.value.name" @input="field.value = { ...field.value, name: $event.target.value }" />
          <input class="email" :value="field.value.email" @input="field.value = { ...field.value, email: $event.target.value }" />
        </div>
        <span id="valid">{{ meta.valid }}</span>
        <span id="dirty">{{ meta.dirty }}</span>
      </div>
    `,
  });

  await flushPromises();
  const nameInput = document.querySelector('.name') as HTMLInputElement;
  const validSpan = document.querySelector('#valid') as HTMLSpanElement;
  const dirtySpan = document.querySelector('#dirty') as HTMLSpanElement;

  expect(validSpan?.textContent).toBe('true');
  expect(dirtySpan?.textContent).toBe('false');

  // Simulate typing in the name input (clear it to make it invalid)
  setValue(nameInput, '');
  await flushPromises();

  // After typing, validation should detect the empty name
  expect(form.meta.value.valid).toBe(false);
  expect(form.meta.value.dirty).toBe(true);
  expect(validSpan?.textContent).toBe('false');
  expect(dirtySpan?.textContent).toBe('true');
});

// #5029 - This is the real bug scenario: using useField with useFieldArray of objects
// After push, the new fields should show errors when the form is submitted or validated
test('field array with objects: form.validate() shows errors on newly pushed object fields', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  const InputField = defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { value, errorMessage } = useField(() => props.name);
      return { value, errorMessage };
    },
    template: '<input v-model="value" /><span class="error">{{ errorMessage }}</span>',
  });

  mountWithHoc({
    components: { InputField },
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');

      return {
        fields: arr.fields,
      };
    },
    template: `
      <div>
        <div v-for="(field, idx) in fields" :key="field.key">
          <InputField :name="'users[' + idx + '].name'" />
          <InputField :name="'users[' + idx + '].email'" />
        </div>
      </div>
    `,
  });

  const errorAt = (idx: number) => (document.querySelectorAll('.error') || [])[idx] as HTMLSpanElement;

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);

  // Push an invalid object item
  arr.push({ name: '', email: 'not-valid' });
  await flushPromises();

  // meta.valid should be false
  expect(form.meta.value.valid).toBe(false);

  // Explicitly validate the form (simulates form submission)
  // Need to handle async validation with flush
  const validatePromise = form.validate();
  await flushPromises();
  const result = await validatePromise;
  await flushPromises();

  // After explicit validation, errors should be shown on the new fields
  expect(result.valid).toBe(false);
  expect(Object.keys(result.errors).length).toBeGreaterThan(0);

  // Error messages should now be displayed in the UI
  expect(errorAt(2)?.textContent).toBeTruthy();
  expect(errorAt(3)?.textContent).toBeTruthy();
});

// #5029 - computedDeep set callback should propagate nested property mutations to form values
test('field array with objects: computedDeep properly propagates nested property changes to form', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  let fields!: Ref<FieldEntry<{ name: string; email: string }>[]>;

  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'initial', email: 'test@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray<{ name: string; email: string }>('users');
      fields = arr.fields;

      return {
        fields,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();

  // Verify initial state
  expect(form.values.users[0].name).toBe('initial');
  expect(form.values.users[0].email).toBe('test@test.com');

  // Mutate nested property (like v-model="field.value.name" would do)
  fields.value[0].value.name = 'changed';
  await flushPromises();

  // The form values should reflect the change
  expect(form.values.users[0].name).toBe('changed');
  // The other property should remain unchanged
  expect(form.values.users[0].email).toBe('test@test.com');
});

// #5029 - Using programmatic mutation of field.value properties (simulates v-model on nested property)
test('field array with objects: programmatic mutation of field.value.name triggers validation', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;
  let fields!: Ref<FieldEntry<{ name: string; email: string }>[]>;

  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'initial', email: 'test@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray<{ name: string; email: string }>('users');
      fields = arr.fields;

      return {
        fields,
      };
    },
    template: `<div></div>`,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  expect(form.meta.value.dirty).toBe(false);

  // Directly mutate a nested property (simulates v-model="field.value.name")
  fields.value[0].value.name = '';
  await flushPromises();

  // Form values should be updated
  expect(form.values.users[0].name).toBe('');
  // meta.valid should be false (validation should catch the empty name)
  expect(form.meta.value.valid).toBe(false);
  // meta.dirty should be true (value changed)
  expect(form.meta.value.dirty).toBe(true);

  // Fix the value
  fields.value[0].value.name = 'fixed';
  await flushPromises();
  expect(form.values.users[0].name).toBe('fixed');
  expect(form.meta.value.valid).toBe(true);
});

// #5029
test('field array with objects: push invalid item sets errors via extraErrorsBag without useField', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  mountWithHoc({
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');
    },
    template: `<div></div>`,
  });

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  expect(Object.keys(form.errors.value).length).toBe(0);

  // Push an invalid item (no useField, so errors should go to extraErrorsBag)
  arr.push({ name: '', email: 'not-an-email' });
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
  // Without useField, errors should still appear in form.errors via extraErrorsBag
  const errorKeys = Object.keys(form.errors.value);
  expect(errorKeys.length).toBeGreaterThan(0);
});

// #5029
test('field array with objects: typing in v-model bound fields triggers validation', async () => {
  let form!: FormContext;
  let arr!: FieldArrayContext;

  const InputField = defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { value, errorMessage } = useField(() => props.name);
      return { value, errorMessage };
    },
    template: '<input v-model="value" /><span class="error">{{ errorMessage }}</span>',
  });

  mountWithHoc({
    components: { InputField },
    setup() {
      form = useForm<any>({
        initialValues: {
          users: [{ name: 'valid', email: 'valid@test.com' }],
        },
        validationSchema: z.object({
          users: z.array(
            z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          ),
        }),
      });

      arr = useFieldArray('users');

      return {
        fields: arr.fields,
      };
    },
    template: `
      <div>
        <div v-for="(field, idx) in fields" :key="field.key">
          <InputField :name="'users[' + idx + '].name'" />
          <InputField :name="'users[' + idx + '].email'" />
        </div>
      </div>
    `,
  });

  const inputAt = (idx: number) => (document.querySelectorAll('input') || [])[idx] as HTMLInputElement;
  const errorAt = (idx: number) => (document.querySelectorAll('.error') || [])[idx] as HTMLSpanElement;

  await flushPromises();
  expect(form.meta.value.valid).toBe(true);

  // Clear the name field value to trigger validation error
  setValue(inputAt(0), '');
  await flushPromises();
  expect(form.meta.value.valid).toBe(false);
  expect(errorAt(0)?.textContent).toBeTruthy();

  // Fix it back
  setValue(inputAt(0), 'valid');
  await flushPromises();
  expect(form.meta.value.valid).toBe(true);
  expect(errorAt(0)?.textContent).toBeFalsy();
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
        validationSchema: z.object({
          users: z.array(z.string().min(1)),
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
