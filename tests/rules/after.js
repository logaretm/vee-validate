import moment from 'moment';
import after from './../../src/plugins/date/after';
import helpers from './../helpers';

const validate = after(moment);

test('sets the format and inclusion params if not passed', () => {
  const format = 'DD/MM/YYYY';
  expect(validate('12/09/2016', ['11/09/2016', format])).toBe(true);
  expect(validate('10/09/2016', ['11/09/2016', format])).toBe(false);
});

test('checks if a date is after another date', () => {
  const format = 'DD/MM/YYYY';
  expect(validate('12/09/2016', ['11/09/2016', false, format])).toBe(true);
  expect(validate('10/09/2016', ['11/09/2016', false, format])).toBe(false);

  // test inclusion
  expect(validate('11/09/2016', ['11/09/2016', true, format])).toBe(true);
  expect(validate('11/09/2016', ['11/09/2016', false, format])).toBe(false);
});

test('fails validation if any date is invalid', () => {
  const format = 'DD/MM/YYYY';
  expect(validate('12/09/2016', ['11/15/2016', false, format])).toBe(false);
  expect(validate('31/09/2016', ['11/10/2016', false, format])).toBe(false);
});
