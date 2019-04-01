import { validate } from '@/rules/after';

test('sets the format and inclusion params if not passed', () => {
  expect(validate(new Date(2016, 9, 12), { targetValue: new Date(2016, 9, 11) })).toBe(true);
  expect(validate(new Date(2016, 9, 10), { targetValue: new Date(2016, 9, 11) })).toBe(false);
});

test('checks if a date is after another date', () => {
  expect(validate(new Date(2016, 9, 12), { targetValue: new Date(2016, 9, 11), inclusion: false })).toBe(true);
  expect(validate(new Date(2016, 9, 10), { targetValue: new Date(2016, 9, 11), inclusion: false })).toBe(false);

  // test inclusion
  expect(validate(new Date(2016, 9, 11), { targetValue: new Date(2016, 9, 11), inclusion: true })).toBe(true);
  expect(validate(new Date(2016, 9, 11), { targetValue: new Date(2016, 9, 11), inclusion: false })).toBe(false);
});
