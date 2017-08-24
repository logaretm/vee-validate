import validate from './../../src/rules/length';

test('validates number of characters in a string', () => {
  // exact length
  expect(validate('hey', [3])).toBe(true);
  expect(validate('hello', [3])).toBe(false);
  
  // min-max
  expect(validate('hey', [4, 5])).toBe(false);
  expect(validate('hello', [3, 5])).toBe(true);
  expect(validate('hello there', [3, 5])).toBe(false);
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
