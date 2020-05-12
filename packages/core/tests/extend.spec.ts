import { extend, validate } from '@vee-validate/core';

test('passing a non-function as the validate method will throw', () => {
  expect(() => {
    extend('noFn', {
      validate: ('' as unknown) as (value: any) => boolean,
    });
  }).toThrow();
});

test('Can return error messages directly in the validate fn', async () => {
  extend('test-direct', value => {
    if (value === '1') {
      return 'Cannot be 1';
    }

    if (value === '2') {
      return '{_field_} Cannot be 2';
    }

    return true;
  });

  let result = await validate('1', 'test-direct');
  expect(result.errors[0]).toBe('Cannot be 1');

  result = await validate('2', 'test-direct', { name: 'test' });
  expect(result.errors[0]).toBe('test Cannot be 2');
});
