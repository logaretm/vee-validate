import { validate } from '@/rules/before';

test('checks if a date is before another date', () => {
  expect(validate('12/09/2016', { targetValue: new Date(2016, 9, 11) })).toBe(false);
  expect(validate(new Date(2016, 9, 10), { targetValue: new Date(2016, 9, 11) })).toBe(true);

  // test inclusion
  expect(validate(new Date(2016, 9, 11), { targetValue: new Date(2016, 9, 11), inclusion: true })).toBe(true);
  expect(validate(new Date(2016, 9, 11), { targetValue: new Date(2016, 9, 11), inclusion: false })).toBe(false);
});
