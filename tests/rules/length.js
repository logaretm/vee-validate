import { validate } from '@/rules/length';

test('validates number of characters in a string', () => {
  // exact length
  expect(validate('hey', [3])).toBe(true);
  expect(validate('hello', [3])).toBe(false);

  // min-max
  expect(validate('hey', [4, 5])).toBe(false);
  expect(validate('hello', [3, 5])).toBe(true);
  expect(validate('hello there', [3, 5])).toBe(false);
});

test('null and undefined are always rejected', () => {
  expect(validate(null, [3])).toBe(false);
  expect(validate(undefined, [3])).toBe(false);
});

test('validates number of elements in an enumerable', () => {
  const firstSet = new Set(['h', 'e', 'y']);
  const secondSet = new Set(['h', 'e', 'l', 'l']);
  expect(validate(firstSet, [3])).toBe(true);
  expect(validate(secondSet, [4])).toBe(false);

  // min-max
  expect(validate(firstSet, [4, 5])).toBe(false);
  expect(validate(secondSet, [3, 5])).toBe(true);
  expect(validate(new Set(['h', 'e', 'l', 'l', 'o', ' ', 't', 'h', 'e', 'r', 'e']), [3, 5])).toBe(false);
});

test('validates number of elements in an array', () => {
  // exact length
  expect(validate(['h', 'e', 'y'], [3])).toBe(true);
  expect(validate(['h', 'e', 'l', 'l', 'o'], [3])).toBe(false);

  // min-max
  expect(validate(['h', 'e', 'y'], [4, 5])).toBe(false);
  expect(validate(['h', 'e', 'l', 'l', 'o'], [3, 5])).toBe(true);
  expect(validate(['h', 'e', 'l', 'l', 'o', ' ', 't', 'h', 'e', 'r', 'e'], [3, 5])).toBe(false);
});

test('validates strings consisting of numbers', () => {
  expect(validate(123, [3])).toBe(true);
});
