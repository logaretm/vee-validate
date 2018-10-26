import { validate } from '@/rules/integer';

const valid = [
  '1234567890',
  123,
  -123,
  '-1234'
];

const invalid = [
  'a',
  '1234567a89',
  null,
  undefined,
  true,
  false,
  {},
  '+123',
  12.2,
  '13.3'
];

test('validates integer numbers', () => {
  expect.assertions(16);
  // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));
  expect(validate(valid)).toBe(true);

  // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
  expect(validate(invalid)).toBe(false);
});
