import { validate } from '@/rules/max';

const valid = [123, 'abc', 1, 12, undefined, null, ''];

const invalid = ['abcde', 'null', 'undefined'];

test('validates maximum number of characters in a string', () => {
  expect.assertions(10);
  const limit = 3;

  // valid.
  valid.forEach(value => expect(validate(value, { length: limit })).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value, { length: limit })).toBe(false));
});

test('handles array of values', () => {
  expect(validate(valid, { length: 3 })).toBe(true);

  expect(validate(invalid, { length: 3 })).toBe(false);
});
