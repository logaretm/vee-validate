import flushPromises from 'flush-promises';
import { useField, useFieldError, useForm } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

describe('useFieldError()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('gives access to a form field error', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const message = useFieldError('test');

        return {
          value,
          message,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ message }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);
  });
});