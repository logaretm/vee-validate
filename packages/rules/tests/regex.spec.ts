import validate from '../src/regex';

test('validates regular expressions', () => {
  const params = { regex: /^[0-9]+$/ };
  expect(validate('1234567890', params)).toBe(true);
  expect(validate('abc', params)).toBe(false);
  expect(validate('abc-123', params)).toBe(false);
  expect(validate('1234abc5', params)).toBe(false);
  expect(validate(['1234567890', '321'], params)).toBe(true);
  expect(validate(['1234567890', 'abc'], params)).toBe(false);

  // empty values should pass
  expect(validate('', params)).toBe(true); // empty values pass
  expect(validate(undefined, params)).toBe(true); // empty values pass
  expect(validate(null, params)).toBe(true); // empty values pass
  expect(validate([], params)).toBe(true); // empty values pass
});
