import validate from '../src/max_value';

test('validates number maximum value', () => {
  const params = { max: 10 };

  // valid.
  expect(validate(0, params)).toBe(true);
  expect(validate('1', params)).toBe(true);
  expect(validate(10, params)).toBe(true);
  expect(validate([10], params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([], params)).toBe(true);

  // invalid
  expect(validate(10.01, params)).toBe(false);
  expect(validate(11, params)).toBe(false);
  expect(validate({}, params)).toBe(false);
  expect(validate('abc', params)).toBe(false);
  expect(validate([10.01], params)).toBe(false);
});
