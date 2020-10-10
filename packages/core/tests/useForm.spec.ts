import flushPromises from 'flush-promises';
import { useField, useForm } from '@vee-validate/core';
import { mountWithHoc } from './helpers';

describe('useForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';

  test('sets individual field errors', async () => {
    mountWithHoc({
      setup() {
        const { setFieldError } = useForm();
        const { errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          errorMessage,
          setFieldError,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
      <button @click="setFieldError('field', 'WRONG')">Set Field Error</button>
    `,
    });

    const error = document.querySelector('span');
    await flushPromises();
    expect(error?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(error?.textContent).toBe('WRONG');
  });

  test('sets multiple field errors', async () => {
    mountWithHoc({
      setup() {
        const { setErrors } = useForm();
        const { errorMessage: err1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { errorMessage: err2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          err1,
          err2,
          setErrors,
        };
      },
      template: `
      <span>{{ err1 }}</span>
      <span>{{ err2 }}</span>
      <button @click="setErrors({ field1: 'WRONG', field2: 'WRONG AGAIN' })">Set Field Error</button>
    `,
    });

    const errors = document.querySelectorAll('span');
    await flushPromises();
    expect(errors[0]?.textContent).toBe('');
    expect(errors[1]?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(errors[0]?.textContent).toBe('WRONG');
    expect(errors[1]?.textContent).toBe('WRONG AGAIN');
  });
});
