import { validate } from '@/rules/min';

const valid = [
  'asjdj',
  'null',
  'undefined',
  123,
  'abc'
];

const invalid = [
  1,
  12,
  undefined,
  null,
  ''
];

test('validates minimum number of characters in a string', () => {
  expect.assertions(10);
  const limit = 3;
  // valid.
  valid.forEach(value => expect(validate(value, [limit])).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value, [limit])).toBe(false));
});

test('handles array of values', () => {
  expect(validate(valid, [3])).toBe(true);

  expect(validate(invalid, [3])).toBe(false);
});
