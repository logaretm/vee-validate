import { validate } from '@/rules/is';

test('checks if the value matches another', () => {
  expect(validate(1, ['1'])).toBe(false);
  expect(validate(1, [1])).toBe(true);
  expect(validate(1)).toBe(false);
  expect(validate({}, [{}])).toBe(false);
  const obj = {};
  expect(validate(obj, [obj])).toBe(true);
});
