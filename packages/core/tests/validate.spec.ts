import { validate, defineRule } from '@vee-validate/core';
import { numeric } from '@vee-validate/rules';

test('allows empty rules for the string format', async () => {
  defineRule('numeric', numeric);
  let result = await validate(100, '|numeric');
  expect(result.valid).toBe(true);

  result = await validate(100, '||||numeric');
  expect(result.valid).toBe(true);
});
