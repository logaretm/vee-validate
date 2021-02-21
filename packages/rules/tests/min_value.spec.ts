import validate from '../src/min_value';

test('validates number minimum value', () => {
  const params = { min: -1 };
  expect(validate(-1, params)).toBe(true);
  expect(validate(0, params)).toBe(true);
  expect(validate('5', params)).toBe(true);
  expect(validate([-1, 5], params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([], params)).toBe(true);

  // invalid
  expect(validate({}, params)).toBe(false);
  expect(validate('abc', params)).toBe(false);
  expect(validate(-2, params)).toBe(false);
  expect(validate('-3', params)).toBe(false);
  expect(validate(['-3'], params)).toBe(false);
});
