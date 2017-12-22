import validate from './../../../src/rules/alpha_spaces';

const valid = [
  'a',
  'abcdefgHijklMnOpqRsTUVwxYZ',
  '',
  null,
  undefined,
  'null',
  'undefined',
  true,
  false,
  'this is sparta',
  ' ',
  ['adasd dasdasda', 'yy']
];

const invalid = [
  '123-abc',
    {},
  '1234567890',
  'abc123',
  123,
  ['adasd dasdasda', '123']
];

test('validates that the string may only contain alphabetic characters and spaces', () => {
  expect.assertions(18);
    // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام عليكم')).toBe(true);
  expect(validate('Привет т')).toBe(true);

  // specfic locale
  expect(validate('peace', ['ar'])).toBe(false);
  expect(validate('peace', ['ru'])).toBe(false);

  // non-existant locale defaults to english validation.
  expect(validate('peace', ['blah'])).toBe(true);
  expect(validate('اين اشيائي', ['blah'])).toBe(false); // non english characters.
});
