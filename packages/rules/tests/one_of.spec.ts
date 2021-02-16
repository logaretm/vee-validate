import validate from '../src/one_of';

test('validates that the value exists within a list', () => {
  const list = [1, 2, 3, 4, 5];

  // valid.
  expect(validate(1, list)).toBe(true);
  expect(validate(2, list)).toBe(true);
  expect(validate(3, list)).toBe(true);
  expect(validate(4, list)).toBe(true);
  expect(validate(5, list)).toBe(true);

  // invalid
  expect(validate(0, list)).toBe(false);
  expect(validate(6, list)).toBe(false);
  expect(validate([1, 6], list)).toBe(false);
});
