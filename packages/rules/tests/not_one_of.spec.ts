import validate from '../src/not_one_of';

test('validates that the value does not exist within a list', () => {
  const list = [1, 2, 3, 4, 5];

  // valid.
  expect(validate(0, list)).toBe(true);
  expect(validate(6, list)).toBe(true);
  expect(validate([6], list)).toBe(true);

  // invalid
  expect(validate(1, list)).toBe(false);
  expect(validate(2, list)).toBe(false);
  expect(validate(3, list)).toBe(false);
  expect(validate(4, list)).toBe(false);
  expect(validate(5, list)).toBe(false);
  expect(validate([1, 2], list)).toBe(false);
});
