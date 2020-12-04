import flushPromises from 'flush-promises';
import { useField, useForm, useValidateForm } from '@/vee-validate';
import { mountWithHoc } from './helpers';

describe('useValidateForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';
  const rules = (val: any) => (val ? true : REQUIRED_MESSAGE);

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
