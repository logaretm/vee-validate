import validate from './../../../src/rules/date_format';

test('validates a date format', () => {
  expect(validate('2010-10-20 04:30', ['YYYY-MM-DD HH:mm'])).toBe(true);
  expect(validate('2010-10-20 4:30', ['YYYY-MM-DD HH:mm'])).toBe(false);
  expect(validate('2010-10-20', ['YYYY-MM-DD HH:mm'])).toBe(false);
  expect(validate('2010-10-20 24:01', ['YYYY-MM-DD HH:mm'])).toBe(false);
  expect(validate('2010-10-20 4:61', ['YYYY-MM-DD HH:mm'])).toBe(false);
});
