import { useForm, useIsValidating } from '@/vee-validate';
import { mountWithHoc, flushPromises } from './helpers';
import { expect } from 'vitest';
import * as z from 'zod';

describe('useIsValidating()', () => {
  test('indicates if a form is validating', async () => {
    const spy = vi.fn((isValidating: boolean) => isValidating);

    mountWithHoc({
      setup() {
        const { validate } = useForm({
          validationSchema: {
            name: z
              .string()
              .refine(() => {
                spy(isValidating.value);
                return true;
              })
              .default(''),
          },
        });

        const isValidating = useIsValidating();

        return {
          validate,
        };
      },
      template: `
      <button @click="validate">Submit</button>
    `,
    });

    await flushPromises();
    // triggered by validateObjectSchema method
    expect(spy).toHaveBeenCalledTimes(1);
    const button = document.querySelector('button');
    button?.click();

    await flushPromises();
    // triggered by formCtx validate method
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveLastReturnedWith(true);
  });

  test('returns false and warns if form is not found', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // NOOP
    });
    mountWithHoc({
      setup() {
        const isValidating = useIsValidating();

        return {
          isValidating,
        };
      },
      template: `
      <span>{{ isValidating.toString() }}</span>
    `,
    });

    await flushPromises();
    const validatingText = document.querySelector('span');
    expect(validatingText?.textContent).toBe('false');
    expect(console.warn).toHaveBeenCalled();
    spy.mockRestore();
  });
});
