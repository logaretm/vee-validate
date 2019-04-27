import { validate } from '@/rules/length';

test('validates number of characters in a string', () => {
  // exact length
  expect(validate('hey', { length: 3 })).toBe(true);
  expect(validate('hello', { length: 3 })).toBe(false);

  // min-max
  expect(validate('hey', { length: 4, max: 5 })).toBe(false);
  expect(validate('hello', { length: 3, max: 5 })).toBe(true);
  expect(validate('hello there', { length: 3, max: 5 })).toBe(false);
});

test('null and undefined are always rejected', () => {
  expect(validate(null, { length: 3 })).toBe(false);
  expect(validate(undefined, { length: 3 })).toBe(false);
});

test('validates number of elements in an enumerable', () => {
  const firstSet = new Set(['h', 'e', 'y']);
  const secondSet = new Set(['h', 'e', 'l', 'l']);
  expect(validate(firstSet, { length: 3 })).toBe(true);
  expect(validate(secondSet, { length: 4 })).toBe(false);

  // min-max
  expect(validate(firstSet, { length: 4, max: 5 })).toBe(false);
  expect(validate(secondSet, { length: 3, max: 5 })).toBe(true);
  expect(validate(new Set(['h', 'e', 'l', 'l', 'o', ' ', 't', 'h', 'e', 'r', 'e']), { length: 3, max: 5 })).toBe(false);
});

test('validates number of elements in an array', () => {
  // exact length
  expect(validate(['h', 'e', 'y'], { length: 3 })).toBe(true);
  expect(validate(['h', 'e', 'l', 'l', 'o'], { length: 3 })).toBe(false);

  // min-max
  expect(validate(['h', 'e', 'y'], { length: 4, max: 5 })).toBe(false);
  expect(validate(['h', 'e', 'l', 'l', 'o'], { length: 4, max: 5 })).toBe(true);
  expect(validate(['h', 'e', 'l', 'l', 'o', ' ', 't', 'h', 'e', 'r', 'e'], { length: 3, max: 5 })).toBe(false);
});

test('validates strings consisting of numbers', () => {
  expect(validate(123, { length: 3 })).toBe(true);
});
