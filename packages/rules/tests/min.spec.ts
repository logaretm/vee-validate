import validate from '../src/min';

test('validates minimum number of characters in a string', () => {
  const params = { length: 3 };
  // valid.
  expect(validate('asjdj', params)).toBe(true);
  expect(validate('null', params)).toBe(true);
  expect(validate('undefined', params)).toBe(true);
  expect(validate(123, params)).toBe(true);
  expect(validate('abc', params)).toBe(true);
  expect(validate([123, '123', 'abc'], params)).toBe(true);
  expect(validate(undefined, params)).toBe(true);
  expect(validate(null, params)).toBe(true);
  expect(validate('', params)).toBe(true);
  expect(validate([], params)).toBe(true);

  // invalid
  expect(validate(1, params)).toBe(false);
  expect(validate(12, params)).toBe(false);
  expect(validate([1], params)).toBe(false);
});
