import { validate } from '@/rules/alpha_num';

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
  false,
  ['asdad', 123, 'asd2123']
];

const invalid = [
  'this is sparta',
  '123-abc',
  {},
  ' ',
  ['asdasda  ', '123 ad']
];

test('validates that the string may only contain alphabetic and numeric characters', () => {
  expect.assertions(18);
  // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام12')).toBe(true);
  expect(validate('Привет12')).toBe(true);

  // specfic locale
  expect(validate('peace', { locale: 'ar' })).toBe(false);
  expect(validate('peace', { locale: 'ru' })).toBe(false);

  // non-existant locale defaults to english validation.
  expect(validate('peace', { locale: 'blah' })).toBe(true);
  expect(validate('اين اشيائي', { locale: 'blah' })).toBe(false); // non english characters.
});
