import { useForm, useFieldArray } from '@/vee-validate';
import { onMounted } from 'vue';
import { mountWithHoc, flushPromises } from './helpers';

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
