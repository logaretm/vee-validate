import { validate } from '@/rules/max_value';

const valid = [0, '1', 10];

const invalid = ['', 10.01, 11, [], undefined, null, {}, 'abc'];

const bigInts = ['9223372036854775806', '922337203685477584513', 92233798596859775896n];

test('validates number maximum value', () => {
  expect.assertions(14);
  const max = 10;

  // valid.
  valid.forEach(value => expect(validate(value, { max })).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value, { max })).toBe(false));

  // invalid big integers
  bigInts.forEach(value => expect(validate(value, { max: BigInt(Number.MAX_SAFE_INTEGER + 1) })).toBe(false));
});

test('handles array of values', () => {
  expect(validate(valid, { max: 10 })).toBe(true);

  expect(validate(invalid, { max: 10 })).toBe(false);

  expect(validate(bigInts, { max: 10 })).toBe(false);
});
