import validate from './../../../src/rules/alpha';

const valid = [
  'abcdefgHijklMnOpqRsTUVwxYZ',
  '',
  null,
  undefined,
  'null',
  'undefined',
  true,
  false,
  ['abcdefg', 'hijk', 'lmnopq']
];

const invalid = [
  'this is sparta',
  '1234567a89',
  {},
  ' ',
  ['abcdefg', 'hijk', 'lmnopq123']
];

test('validates that the string may only contains alphabetic characters', () => {
  expect.assertions(14);
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

  // non-existant locale defaults to english validation.
  expect(validate('peace', ['blah'])).toBe(true);
  expect(validate('اين اشيائي', ['blah'])).toBe(false); // non english characters.
});
