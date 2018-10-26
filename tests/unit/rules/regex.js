import { validate } from '@/rules/regex';

test('validates regular expressions', () => {
  const expression = /^[0-9]+$/;
  expect(validate('1234567890', { expression })).toBe(true);
  expect(validate('abc', { expression })).toBe(false);
  expect(validate('abc-123', { expression })).toBe(false);
  expect(validate('1234abc5', { expression })).toBe(false);
  expect(validate('', { expression })).toBe(false);
  expect(validate(['1234567890', '321'], { expression })).toBe(true);
  expect(validate(['1234567890', 'abc'], { expression })).toBe(false);
});

test('validates with strings as regular expressions', () => {
  const expression = '^[0-9]+$';
  expect(validate('1234567890', { expression })).toBe(true);
  expect(validate('abc', { expression })).toBe(false);
  expect(validate('abc-123', { expression })).toBe(false);
  expect(validate('1234abc5', { expression })).toBe(false);
  expect(validate('', { expression })).toBe(false);
  expect(validate(['1234567890', '321'], { expression })).toBe(true);
  expect(validate(['1234567890', 'abc'], { expression })).toBe(false);
});
