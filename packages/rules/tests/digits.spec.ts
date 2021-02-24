import validate from '../src/digits';

test('validates digits', () => {
  const params = { length: 3 }; // 3 digits only.
  expect(validate('123', params)).toBe(true);
  expect(validate('456', params)).toBe(true);
  expect(validate('789', params)).toBe(true);
  expect(validate('012', params)).toBe(true);
  expect(validate('000', params)).toBe(true);
  expect(validate(['012', '789'], params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([], params)).toBe(true);

  // invalid
  expect(validate(0, params)).toBe(false);
  expect(validate({}, params)).toBe(false);
  expect(validate('1234', params)).toBe(false);
  expect(validate('12', params)).toBe(false);
  expect(validate('abc', params)).toBe(false);
  expect(validate('12a', params)).toBe(false);
  expect(validate(['123', '12a'], params)).toBe(false);
});
