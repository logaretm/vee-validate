import validate from '../src/required';

test('validates required', () => {
  // valid
  expect(validate('asjdj')).toBe(true);
  expect(validate(0)).toBe(true);
  expect(validate('undefined')).toBe(true);
  expect(validate('null')).toBe(true);
  expect(validate('s ')).toBe(true);
  expect(validate(true)).toBe(true);

  // invalid
  expect(validate('')).toBe(false);
  expect(validate(' ')).toBe(false);
  expect(validate([])).toBe(false);
  expect(validate(undefined)).toBe(false);
  expect(validate(null)).toBe(false);
  expect(validate(false)).toBe(false);
});
