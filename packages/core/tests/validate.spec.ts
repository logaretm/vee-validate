import { validate, defineRule } from '@/core';
import { numeric } from '@/rules';

test('allows empty rules for the string format', async () => {
  defineRule('numeric', numeric);
  let result = await validate(100, '|numeric');
  expect(result.errors).toHaveLength(0);

  result = await validate(100, '||||numeric');
  expect(result.errors).toHaveLength(0);
});

test('handles targets expressed in objects', async () => {
  defineRule('confirmed', (value, { target }: any) => {
    return value === target ? true : 'must match';
  });

  let result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: '' } });
  expect(result.errors).toHaveLength(1);

  result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: 'test' } });
  expect(result.errors).toHaveLength(0);
});
