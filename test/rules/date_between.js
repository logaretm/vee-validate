import test from 'ava';
import validate from './../../src/rules/date_between';

test('checks if a date is between two other dates - exclusive', t => {
  const format = 'DD/MM/YYYY';

  t.true(validate('16/09/2016', ['01/09/2016', '20/09/2016', format]));
  t.false(validate('16/09/2016', ['01/9/2016', '15/09/2016', format]));
});


test('fails the valiadation if any date is in incorrect format', t => {
  const format = 'DD/MM/YYYY';

  t.false(validate('09/16/2016', ['01/09/2016', '20/09/2016', format])); // invalid value.
  t.false(validate('16/09/2016', ['199/10/2016', '20/09/2016', format])); // invalid low bound.
  t.false(validate('16/09/2016', ['01/09/2016', '1/15/2016', format])); // invalid upper bound.
});

test('checks if a date is between two other dates - left inclusive', t => {
  const format = 'DD/MM/YYYY';

  t.true(validate('01/09/2016', ['01/09/2016', '20/09/2016', '[)', format]));
  t.false(validate('20/09/2016', ['01/09/2016', '20/09/2016', '[)', format]));
});

test('checks if a date is between two other dates - right inclusive', t => {
  const format = 'DD/MM/YYYY';

  t.false(validate('01/09/2016', ['01/09/2016', '20/09/2016', '(]', format]));
  t.true(validate('20/09/2016', ['01/09/2016', '20/09/2016', '(]', format]));
});


test('checks if a date is between two other dates - all inclusive', t => {
  const format = 'DD/MM/YYYY';

  t.true(validate('01/09/2016', ['01/09/2016', '20/09/2016', '[]', format]));
  t.true(validate('20/09/2016', ['01/09/2016', '20/09/2016', '[]', format]));
});
