import moment from 'moment';
import before from './../../src/plugins/date/before';
import helpers from './../helpers';

const validate = before(moment);

test('sets the format and inclusion params if not passed', () => {
  const format = 'DD/MM/YYYY';
  expect(validate('10/09/2016', ['11/09/2016', format])).toBe(true);
  expect(validate('12/09/2016', ['11/09/2016', format])).toBe(false);
});

test('checks if a date is before another date', () => {
  const format = 'DD/MM/YYYY';
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  expect(validate('12/09/2016', ['otherField', false, format])).toBe(false);
  expect(validate('10/09/2016', ['otherField', false, format])).toBe(true);

  // test inclusion
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  expect(validate('11/09/2016', ['otherField', true, format])).toBe(true);
  expect(validate('11/09/2016', ['otherField', false, format])).toBe(false);
});


test('it accepts dates instead of fields', () => {
  const format = 'DD/MM/YYYY';
  expect(validate('12/09/2016', ['11/09/2016', false, format])).toBe(false);
  expect(validate('10/09/2016', ['11/09/2016', false, format])).toBe(true);

  // test inclusion
  expect(validate('12/09/2016', ['12/09/2016', false, format])).toBe(false);
  expect(validate('10/09/2016', ['10/09/2016', true, format])).toBe(true);
});

test('fails validation if any date is invalid', () => {
  const format = 'DD/MM/YYYY';
  helpers.querySelector({ name: 'otherField', value: '11/15/2016' });
  expect(validate('12/09/2016', ['otherField', false, format])).toBe(false);
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  expect(validate('32/08/2016', ['otherField', false, format])).toBe(false); // invalid value.
});
