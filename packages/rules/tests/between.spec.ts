import validate from '../src/between';

test('validates numbers range', () => {
  const params = { min: 1, max: 3 };
  expect(validate('1', params)).toBe(true);
  expect(validate(2, params)).toBe(true);
  expect(validate(3, params)).toBe(true);
  expect(validate([1, 2, 3], params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([], params)).toBe(true);

  // invalid
  expect(validate({}, params)).toBe(false);
  expect(validate('1234', params)).toBe(false);
  expect(validate('12', params)).toBe(false);
  expect(validate('abc', params)).toBe(false);
  expect(validate('12a', params)).toBe(false);
  expect(validate(0, params)).toBe(false);
  expect(validate(4, params)).toBe(false);
  expect(validate(-1, params)).toBe(false);
  expect(validate([4, 5, 6], params)).toBe(false);
});

test('validates numbers range including negative numbers', () => {
  const range = { min: -10, max: 1 };
  expect(validate(0, range)).toBe(true);
  expect(validate('-9', range)).toBe(true);
});
