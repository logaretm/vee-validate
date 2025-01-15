import validate from '../src/alpha';

test('validates that the string may only contains alphabetic characters', () => {
  expect(validate('abcdefgHijklMnOpqRsTUVwxYZ', [undefined])).toBe(true);
  expect(validate('', [undefined])).toBe(true);
  expect(validate(null, [undefined])).toBe(true);
  expect(validate(undefined, [undefined])).toBe(true);
  expect(validate('null', [undefined])).toBe(true);
  expect(validate('undefined', [undefined])).toBe(true);
  expect(validate(true, [undefined])).toBe(true);
  expect(validate(false, [undefined])).toBe(true);
  expect(validate(['abcdefg', 'hijk', 'lmnopq'], [undefined])).toBe(true);

  // invalid
  expect(validate('this is sparta', [undefined])).toBe(false);
  expect(validate('1234567a89', [undefined])).toBe(false);
  expect(validate({}, [undefined])).toBe(false);
  expect(validate(' ', [undefined])).toBe(false);
  expect(validate(['abcdefg', 'hijk', 'lmnopq123'], [undefined])).toBe(false);
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام', [undefined])).toBe(true);
  expect(validate('Привет', [undefined])).toBe(true);

  // specific locale
  expect(validate('peace', { locale: 'ar' })).toBe(false);
  expect(validate('peace', { locale: 'ru' })).toBe(false);

  // non-existent locale defaults to english validation.
  expect(validate('peace', { locale: 'blah' })).toBe(true);
  expect(validate('اين اشيائي', { locale: 'blah' })).toBe(false); // non english characters.
});
