import { useField, useForm, useFormValues } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

describe('useFormValues()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

  test('gives access to all form values', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const values = useFormValues();

        return {
          value,
          values,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ values.test }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const valueSpan = document.querySelector('span');
    const inputValue = '1234';
    setValue(input as any, inputValue);
    await flushPromises();
    expect(valueSpan?.textContent).toBe(inputValue);
  });

  test('returns empty object and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const values = useFormValues();

        return {
          values,
        };
      },
      template: `
      <span>{{ values }}</span>
    `,
    });

    await flushPromises();
    const valuesSpan = document.querySelector('span');
    expect(valuesSpan?.textContent).toBe('{}');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
