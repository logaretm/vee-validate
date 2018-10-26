import { validate } from '@/rules/is_not';

test('checks if the value matches another', () => {
  expect(validate(1, ['1'])).toBe(true);
  expect(validate(1, [1])).toBe(false);
  expect(validate(1)).toBe(true);
  expect(validate({}, [{}])).toBe(true);
  const obj = {};
  expect(validate(obj, [obj])).toBe(false);
});
