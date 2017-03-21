import test from 'ava';
import validate from './../../src/rules/alpha_num';

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
  true,
  false
];

const invalid = [
  'this is sparta',
  '123-abc',
    {},
  ' '
];

test('validates that the string may only contain alphabetic and numeric characters', t => {
  t.plan(16);
    // valid.
  valid.forEach(value => t.true(validate(value)));

    // invalid
  invalid.forEach(value => t.false(validate(value)));
});

test('validates the string contains alphabetic chars from other locales', t => {
  // any locale.
  t.true(validate('سلام12'));
  t.true(validate('Привет12'));

  // specfic locale
  t.false(validate('peace', ['ar']));
  t.false(validate('peace', ['ru']));
});
