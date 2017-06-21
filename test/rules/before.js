import test from 'ava';
import validate from './../../src/rules/before';
import helpers from './../helpers';

test('sets the format and inclusion params if not passed', t => {
  const format = 'DD/MM/YYYY';
  t.true(validate('10/09/2016', ['11/09/2016', format]));
  t.false(validate('12/09/2016', ['11/09/2016', format]));
});

test('checks if a date is before another date', t => {
  const format = 'DD/MM/YYYY';
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  t.false(validate('12/09/2016', ['otherField', false, format]));
  t.true(validate('10/09/2016', ['otherField', false, format]));

  // test inclusion
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  t.true(validate('11/09/2016', ['otherField', true, format]));
  t.false(validate('11/09/2016', ['otherField', false, format]));
});


test('it accepts dates instead of fields', t => {
  const format = 'DD/MM/YYYY';
  t.false(validate('12/09/2016', ['11/09/2016', false, format]));
  t.true(validate('10/09/2016', ['11/09/2016', false, format]));

  // test inclusion
  t.false(validate('12/09/2016', ['12/09/2016', false, format]));
  t.true(validate('10/09/2016', ['10/09/2016', true, format]));
});

test('fails validation if any date is invalid', t => {
  const format = 'DD/MM/YYYY';
  helpers.querySelector({ name: 'otherField', value: '11/15/2016' });
  t.false(validate('12/09/2016', ['otherField', false, format]));
  helpers.querySelector({ name: 'otherField', value: '11/09/2016' });
  t.false(validate('32/08/2016', ['otherField', false, format])); // invalid value.
});
