import validate from '../src/length';

test('validates number of characters in a string', () => {
  // exact length
  expect(validate('hey', { length: 3 })).toBe(true);
  expect(validate('hello', { length: 3 })).toBe(false);
});

test('null and undefined are always rejected', () => {
  expect(validate(null as any, { length: 3 })).toBe(false);
  expect(validate(undefined as any, { length: 3 })).toBe(false);
});

test('validates number of elements in an enumerable', () => {
  const firstSet = new Set(['h', 'e', 'y']);
  const secondSet = new Set(['h', 'e', 'l', 'l']);
  expect(validate(firstSet as any, { length: 3 })).toBe(true);
  expect(validate(secondSet as any, { length: 4 })).toBe(false);
});

test('validates number of elements in an array', () => {
  // exact length
  expect(validate(['h', 'e', 'y'], { length: 3 })).toBe(true);
  expect(validate(['h', 'e', 'l', 'l', 'o'], { length: 3 })).toBe(false);
});

test('validates strings consisting of numbers', () => {
  expect(validate(123, { length: 3 })).toBe(true);
});
