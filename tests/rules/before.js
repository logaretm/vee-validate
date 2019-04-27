import { validate } from '@/rules/before';

test('checks if a date is before another date', () => {
  expect(validate('12/09/2016', { target: new Date(2016, 9, 11) })).toBe(false);
  expect(validate(new Date(2016, 9, 10), { target: new Date(2016, 9, 11) })).toBe(true);

  // test allowEqual
  expect(validate(new Date(2016, 9, 11), { target: new Date(2016, 9, 11), allowEqual: true })).toBe(true);
  expect(validate(new Date(2016, 9, 11), { target: new Date(2016, 9, 11), allowEqual: false })).toBe(false);
});
