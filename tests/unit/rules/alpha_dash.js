import validate from './../../../src/rules/alpha_dash';

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
  false,
  ['a', 'b', 'cdef-_']
];

const invalid = [
  'this is sparta',
  {},
  ' ',
  [' ', 'ada as']
];

// eslint-disable-next-line
test('validates that the string may only contain alpha-numeric characters as well as dashes and spaces', () => {
  expect.assertions(19);
    // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});


test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلا-م_')).toBe(true);
  expect(validate('Привет_-')).toBe(true);

  // specfic locale
  expect(validate('peace', ['ar'])).toBe(false);
  expect(validate('peace', ['ru'])).toBe(false);

  // non-existant locale defaults to english validation.
  expect(validate('peace', ['blah'])).toBe(true);
  expect(validate('اين اشيائي', ['blah'])).toBe(false); // non english characters.
});
