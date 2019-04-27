import { validate } from '@/rules/regex';

test('validates regular expressions', () => {
  const regex = /^[0-9]+$/;
  expect(validate('1234567890', { regex })).toBe(true);
  expect(validate('abc', { regex })).toBe(false);
  expect(validate('abc-123', { regex })).toBe(false);
  expect(validate('1234abc5', { regex })).toBe(false);
  expect(validate('', { regex })).toBe(false);
  expect(validate(['1234567890', '321'], { regex })).toBe(true);
  expect(validate(['1234567890', 'abc'], { regex })).toBe(false);
});
