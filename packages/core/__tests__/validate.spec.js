import { validate } from '@/validate';
import { extend } from '@/extend';
import { numeric } from '@/rules';

test('returns custom error messages passed in ValidationOptions', async () => {
  extend('truthy', {
    validate: Boolean,
    message: 'Original Message'
  });

  const customMessage = 'Custom Message';

  const value = false;
  const rules = 'truthy';
  const options = {
    customMessages: {
      truthy: customMessage
    }
  };
  const result = await validate(value, rules, options);

  expect(result.errors[0]).toEqual(customMessage);
});

test('allows empty rules for the string format', async () => {
  extend('numeric', numeric);
  let result = await validate(100, '|numeric');
  expect(result.valid).toBe(true);

  result = await validate(100, '||||numeric');
  expect(result.valid).toBe(true);
});
