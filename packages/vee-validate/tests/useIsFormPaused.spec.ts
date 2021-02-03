import flushPromises from 'flush-promises';
import { useField, useForm, useIsFormPaused } from '@/vee-validate';
import { mountWithHoc } from './helpers';

describe('useIsFormPaused()', () => {
  test('gives access to the forms isPaused status', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value, handleInput, setPaused } = useField('test');
        setPaused(true);
        const isPaused = useIsFormPaused();
        return {
          value,
          isPaused,
          handleInput,
        };
      },
      template: `
      <span>{{ isPaused.toString()  }}</span>
    `,
    });

    const error = document.querySelector('span');
    expect(error?.textContent).toBe('true');
  });

  test('returns false and warns if form is not found', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    mountWithHoc({
      setup() {
        const isPaused = useIsFormPaused();

        return {
          isPaused,
        };
      },
      template: `
      <span>{{ isPaused.toString() }}</span>
    `,
    });

    const error = document.querySelector('span');

    await flushPromises();
    expect(error?.textContent).toBe('false');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
