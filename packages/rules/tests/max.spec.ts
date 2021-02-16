import validate from '../src/max';

test('validates maximum number of characters in a string', () => {
  const params = { length: 3 };
  // valid
  expect(validate(123, params)).toBe(true);
  expect(validate('abc', params)).toBe(true);
  expect(validate(1, params)).toBe(true);
  expect(validate(12, params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([1, 2], params)).toBe(true);

  // invalid
  expect(validate('abcde', params)).toBe(false);
  expect(validate('null', params)).toBe(false);
  expect(validate('undefined', params)).toBe(false);
  expect(validate(['1234'], params)).toBe(false);
});
