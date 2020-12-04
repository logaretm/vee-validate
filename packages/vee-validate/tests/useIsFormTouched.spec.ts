import flushPromises from 'flush-promises';
import { useField, useForm, useIsFormTouched } from '@/vee-validate';
import { dispatchEvent, mountWithHoc } from './helpers';

describe('useIsFormTouched()', () => {
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

  test('returns undefined if form is not found', async () => {
    mountWithHoc({
      setup() {
        const isTouched = useIsFormTouched();

        return {
          isTouched,
        };
      },
      template: `
      <span>{{ isTouched }}</span>
    `,
    });

    await flushPromises();
    const error = document.querySelector('span');
    expect(error?.textContent).toBe('');
  });
});
