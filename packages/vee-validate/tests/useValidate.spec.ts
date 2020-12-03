import flushPromises from 'flush-promises';
import { useField, useForm, useValidateField, useValidateForm } from '@/vee-validate';
import { mountWithHoc } from './helpers';

const REQUIRED_MESSAGE = 'Field is required';
const rules = (val: any) => (val ? true : REQUIRED_MESSAGE);

describe('useValidateField()', () => {
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

describe('useValidateForm()', () => {
  test('validates all fields', async () => {
    let validate!: ReturnType<typeof useValidateForm>;
    mountWithHoc({
      setup() {
        useForm();
        const { errorMessage: e1 } = useField('test', rules);
        const { errorMessage: e2 } = useField('another', rules);
        validate = useValidateForm();

        return {
          e1,
          e2,
        };
      },
      template: `
      <span>{{ e1 }}</span>
      <span>{{ e2 }}</span>
    `,
    });

    await flushPromises();
    const errors = Array.from(document.querySelectorAll('span'));
    expect(errors.map(span => span.textContent)).toEqual(['', '']);
    await validate();
    await flushPromises();
    expect(errors.map(span => span.textContent)).toEqual([REQUIRED_MESSAGE, REQUIRED_MESSAGE]);
  });
});
