import test from 'ava';
import validate from './../../src/rules/alpha_dash';

const valid = [
  'a',
  'abcdefgHijklMnOpqRsTUVwxYZ',
  '1234567890',
  'abc123',
  123,
  '',
  null,
  undefined,
  'null',
  'undefined',
  '123-abc',
  '123_abc',
  true,
  false
];

const invalid = [
  'this is sparta',
  {},
  ' '
];

// eslint-disable-next-line
test('validates that the string may only contain alpha-numeric characters as well as dashes and spaces', t => {
  t.plan(17);
    // valid.
  valid.forEach(value => t.true(validate(value)));

    // invalid
  invalid.forEach(value => t.false(validate(value)));
});


test('validates the string contains alphabetic chars from other locales', t => {
  // any locale.
  t.true(validate('سلا-م_'));
  t.true(validate('Привет_-'));

  // specfic locale
  t.false(validate('peace', ['ar']));
  t.false(validate('peace', ['ru']));
});
