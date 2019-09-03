import { validate } from '@/validate';
import { extend } from '@/extend';

test('returns custom error messages passed in ValidationOptions', async () => {
  extend('truthy', {
    validate: Boolean,
    message: 'Original Message',
  });

  const customMessage = 'Custom Message';

  const value = false;
  const rules = 'truthy';
  const options = {
    customMessages: {
      truthy: customMessage,
    },
  };
  const result = await validate(value, rules, options);

  expect(result.errors[0]).toEqual(customMessage);
});
