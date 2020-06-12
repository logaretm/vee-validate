import { validate, defineRule } from '@vee-validate/core';
import { numeric } from '@vee-validate/rules';

test('allows empty rules for the string format', async () => {
  defineRule('numeric', numeric);
  let result = await validate(100, '|numeric');
  expect(result.valid).toBe(true);

  result = await validate(100, '||||numeric');
  expect(result.valid).toBe(true);
});

test('handles targets expressed in objects', async () => {
  defineRule('confirmed', (value, { target }: any) => {
    return value === target ? true : 'must match';
  });

  let result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: '' } });
  expect(result.valid).toBe(false);

  result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: 'test' } });
  expect(result.valid).toBe(true);
});
