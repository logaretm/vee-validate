import flushPromises from 'flush-promises';
import { useField, useForm } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';
import { useResetForm } from '../src/useResetForm';

describe('useResetForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('resets a form', async () => {
    let resetForm: any;
    let value: any;
    let errorMessage: any;
    mountWithHoc({
      setup() {
        useForm();
        const field = useField('test', validate);
        value = field.value;
        errorMessage = field.errorMessage;
        resetForm = useResetForm();

        return {
          value,
          errorMessage,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ errorMessage }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const error = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(error?.textContent).toBe(REQUIRED_MESSAGE);

    const inputValue = '123';

    resetForm({
      values: {
        test: inputValue,
      },
    });

    await flushPromises();

    await flushPromises();
    expect(error?.textContent).toBe('');
    expect(input?.value).toBe(inputValue);
  });
});
