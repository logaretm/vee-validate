import { useForm, useFieldArray } from '@/vee-validate';
import { onMounted } from 'vue';
import { mountWithHoc, flushPromises } from './helpers';

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

test('warns when updating a no-longer existing item', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  mountWithHoc({
    setup() {
      useForm({
        initialValues: {
          users: ['1'],
        },
      });

      const { remove, fields } = useFieldArray('users');
      onMounted(() => {
        const item = fields.value[0];
        remove(0);
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
