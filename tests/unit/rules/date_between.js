import validate from './../../../src/rules/date_between';

test('checks if a date is between two other dates - exclusive', () => {
  const format = 'DD/MM/YYYY';

  expect(validate('16/09/2016', ['01/09/2016', '20/09/2016', format])).toBe(true);
  expect(validate('16/09/2016', ['01/9/2016', '15/09/2016', format])).toBe(false);
});


test('fails the valiadation if any date is in incorrect format', () => {
  const format = 'DD/MM/YYYY';

  expect(validate('09/16/2016', ['01/09/2016', '20/09/2016', format])).toBe(false); // invalid value.
  expect(validate('16/09/2016', ['199/10/2016', '20/09/2016', format])).toBe(false); // invalid low bound.
  expect(validate('16/09/2016', ['01/09/2016', '1/15/2016', format])).toBe(false); // invalid upper bound.
});

test('checks if a date is between two other dates - left inclusive', () => {
  const format = 'DD/MM/YYYY';

  expect(validate('01/09/2016', ['01/09/2016', '20/09/2016', '[)', format])).toBe(true);
  expect(validate('20/09/2016', ['01/09/2016', '20/09/2016', '[)', format])).toBe(false);
});

test('checks if a date is between two other dates - right inclusive', () => {
  const format = 'DD/MM/YYYY';

  expect(validate('01/09/2016', ['01/09/2016', '20/09/2016', '(]', format])).toBe(false);
  expect(validate('20/09/2016', ['01/09/2016', '20/09/2016', '(]', format])).toBe(true);
});


test('checks if a date is between two other dates - all inclusive', () => {
  const format = 'DD/MM/YYYY';

  expect(validate('01/09/2016', ['01/09/2016', '20/09/2016', '[]', format])).toBe(true);
  expect(validate('20/09/2016', ['01/09/2016', '20/09/2016', '[]', format])).toBe(true);
});

// tests #1104
test('checks against integers', () => {
  const format = 'YYYY';

  expect(validate(2015, ['2000', '2016', '()', format])).toBe(true);
  expect(validate(2016, ['2000', '2016', '()', format])).toBe(false);
});
