import validate from '../src/numeric';

test('validates that the string only contains numeric characters', () => {
  // valid.
  expect(validate('1234567890')).toBe(true);
  expect(validate(123)).toBe(true);
  expect(validate('٠١٢٣٤')).toBe(true);
  expect(validate('٠١٢٣٤٥٦٧٨٩')).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate(null)).toBe(true);
  expect(validate('')).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate(0)).toBe(true);

  // invalid
  expect(validate('a')).toBe(false);
  expect(validate('1234567a89')).toBe(false);
  expect(validate(true)).toBe(false);
  expect(validate(false)).toBe(false);
  expect(validate({})).toBe(false);
  expect(validate('+123')).toBe(false);
  expect(validate('-123')).toBe(false);
});
