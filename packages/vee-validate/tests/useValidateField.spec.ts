import flushPromises from 'flush-promises';
import { useField, useForm, useValidateField } from '@/vee-validate';
import { mountWithHoc } from './helpers';

describe('useValidateField()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const rules = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('validates a single field', async () => {
    let validate!: ReturnType<typeof useValidateField>;
    mountWithHoc({
      setup() {
        useForm();
        const { errorMessage } = useField('test', rules);
        validate = useValidateField('test');

        return {
          errorMessage,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
    await validate();
    await flushPromises();

    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });
});
