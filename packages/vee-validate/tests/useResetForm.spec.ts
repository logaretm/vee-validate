import { FormContext, useField, useForm, useResetForm } from '@/vee-validate';
import { mountWithHoc, setValue, flushPromises } from './helpers';

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
    expect(error?.textContent).toBe('');
    expect(input?.value).toBe(inputValue);
  });

  test('warns if the form does not exist', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    let resetForm: any;

    mountWithHoc({
      setup() {
        resetForm = useResetForm();

        return {};
      },
      template: `<div></div>`,
    });

    resetForm({
      values: {
        test: 'someValue',
      },
    });

    await flushPromises();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('resets a form with passed options', async () => {
    let resetForm: any;
    let form!: FormContext<{ fname: string; lname: string }>;

    mountWithHoc({
      setup() {
        form = useForm({
          initialValues: { fname: '123', lname: '456' },
        });

        resetForm = useResetForm();

        return {};
      },
      template: `
        <div></div>
      `,
    });

    await flushPromises();

    resetForm({ values: { fname: 'test' } }, { force: true });
    expect(form.values.lname).toBeUndefined();
    expect(form.values.fname).toBe('test');
  });
});
