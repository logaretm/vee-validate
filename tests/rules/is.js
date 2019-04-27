import { validate } from '@/rules/is';

test('checks if the value matches another', () => {
  expect(validate(1, { other: '1' })).toBe(false);
  expect(validate(1, { other: 1 })).toBe(true);
  expect(validate(1, { other: 2 })).toBe(false);
  expect(validate({}, { other: {} })).toBe(false);
  const obj = {};
  expect(validate(obj, { other: obj })).toBe(true);
});
