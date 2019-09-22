import { validate } from '@/validate';
import { extend } from '@/extend';
import { confirmed } from '@/rules';

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

describe('target field placeholder', () => {
  extend('confirmed', {
    ...confirmed,
    message: '{_field_} must match {_target_}'
  });

  const names = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };

  test('uses target field name, if supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values,
      names
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match Foo');
  });

  test('uses target field key, if target field name not supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match foo');
  });
});
