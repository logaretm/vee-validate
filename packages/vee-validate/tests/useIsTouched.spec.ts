import flushPromises from 'flush-promises';
import { useField, useForm, useIsFormTouched, useIsFieldTouched } from '@/vee-validate';
import { dispatchEvent, mountWithHoc } from './helpers';

describe('useIsFieldTouched()', () => {
  test('gives access to a field isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        const isTouched = useIsFieldTouched('test');

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');

    await flushPromises();
    expect(error?.textContent).toBe('true');
  });
});

describe('useIsFormValid()', () => {
  test('gives access to the forms isTouched status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleBlur } = useField('test');
        const isTouched = useIsFormTouched();

        return {
          value,
          isTouched,
          handleBlur,
        };
      },
      template: `
      <input name="field" v-model="value" @blur="handleBlur" />
      <span>{{ isTouched.toString()  }}</span>
    `,
    });

    const input = document.querySelector('input');
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('false');

    dispatchEvent(input as any, 'blur');
    await flushPromises();
    expect(error?.textContent).toBe('true');
  });
});
