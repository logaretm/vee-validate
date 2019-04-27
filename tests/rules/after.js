import { validate } from '@/rules/after';

test('checks if a date is after another date', () => {
  expect(validate(new Date(2016, 9, 12), { target: new Date(2016, 9, 11) })).toBe(true);
  expect(validate(new Date(2016, 9, 10), { target: new Date(2016, 9, 11) })).toBe(false);

  // test allowEqual
  expect(validate(new Date(2016, 9, 11), { target: new Date(2016, 9, 11), allowEqual: true })).toBe(true);
  expect(validate(new Date(2016, 9, 11), { target: new Date(2016, 9, 11), allowEqual: false })).toBe(false);
});
