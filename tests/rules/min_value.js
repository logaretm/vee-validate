import { validate } from '@/rules/min_value';

const valid = [-1, 0, '5'];

const invalid = ['', [], undefined, null, {}, 'abc', -2, '-3'];

const bigInts = ['-9223372036854775806', '-922337203685477584513', -92233798596859775896n];

test('validates number minimum value', () => {
  expect.assertions(14);
  const min = -1;

  // valid
  valid.forEach(value => expect(validate(value, { min })).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value, { min })).toBe(false));

  // invalid big integers
  bigInts.forEach(value => expect(validate(value, { min: BigInt(Number.MIN_SAFE_INTEGER - 1) })).toBe(false));
});

test('handles array of values', () => {
  expect(validate(valid, { min: -1 })).toBe(true);

  expect(validate(invalid, { min: -1 })).toBe(false);

  expect(validate(bigInts, { min: -1 })).toBe(false);
});
