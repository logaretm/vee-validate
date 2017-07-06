import validate from './../../src/rules/alpha';

const valid = [
  'abcdefgHijklMnOpqRsTUVwxYZ',
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
  '1234567a89',
    {},
  ' '
];

test('validates that the string may only contains alphabetic characters', () => {
  expect.assertions(12);
    // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام')).toBe(true);
  expect(validate('Привет')).toBe(true);

  // specfic locale
  expect(validate('peace', ['ar'])).toBe(false);
  expect(validate('peace', ['ru'])).toBe(false);
});
