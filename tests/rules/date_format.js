import { validate } from '@/rules/date_format';

test('validates a date format', () => {
  expect(validate('2010-10-20 04:30', { format: 'yyyy-MM-dd HH:mm' })).toBe(true);
  expect(validate('2010-10-20 4:30', { format: 'yyyy-MM-dd HH:mm' })).toBe(false);
  expect(validate('2010-10-20', { format: 'yyyy-MM-dd HH:mm' })).toBe(false);
  expect(validate('2010-10-20 24:01', { format: 'yyyy-MM-dd HH:mm' })).toBe(false);
  expect(validate('2010-10-20 4:61', { format: 'yyyy-MM-dd HH:mm' })).toBe(false);
});
