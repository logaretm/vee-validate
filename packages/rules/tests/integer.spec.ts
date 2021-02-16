import validate from '../src/integer';

test('validates integer numbers', () => {
  expect(validate('1234567890')).toBe(true);
  expect(validate(123)).toBe(true);
  expect(validate(-123)).toBe(true);
  expect(validate('-1234')).toBe(true);

  // invalid
  expect(validate('a')).toBe(false);
  expect(validate('1234567a89')).toBe(false);
  expect(validate(null)).toBe(false);
  expect(validate(undefined)).toBe(false);
  expect(validate(true)).toBe(false);
  expect(validate(false)).toBe(false);
  expect(validate({})).toBe(false);
  expect(validate('+123')).toBe(false);
  expect(validate(12.2)).toBe(false);
  expect(validate('13.3')).toBe(false);
});
