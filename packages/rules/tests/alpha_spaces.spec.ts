import validate from '../src/alpha_spaces';

test('validates that the string may only contain alphabetic characters and spaces', () => {
  expect(validate('a', [undefined])).toBe(true);
  expect(validate('abcdefgHijklMnOpqRsTUVwxYZ', [undefined])).toBe(true);
  expect(validate('', [undefined])).toBe(true);
  expect(validate(null, [undefined])).toBe(true);
  expect(validate(undefined, [undefined])).toBe(true);
  expect(validate('null', [undefined])).toBe(true);
  expect(validate('undefined', [undefined])).toBe(true);
  expect(validate(true, [undefined])).toBe(true);
  expect(validate(false, [undefined])).toBe(true);
  expect(validate('this is sparta', [undefined])).toBe(true);
  expect(validate(' ', [undefined])).toBe(true);
  expect(validate(['adasd dasdasda', 'yy'], [undefined])).toBe(true);

  // invalid
  expect(validate('123-abc', [undefined])).toBe(false);
  expect(validate({}, [undefined])).toBe(false);
  expect(validate('1234567890', [undefined])).toBe(false);
  expect(validate('abc123', [undefined])).toBe(false);
  expect(validate(123, [undefined])).toBe(false);
  expect(validate(['adasd dasdasda', '123'], [undefined])).toBe(false);
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام عليكم', [undefined])).toBe(true);
  expect(validate('Привет т', [undefined])).toBe(true);

  // specific locale
  expect(validate('peace', { locale: 'ar' })).toBe(false);
  expect(validate('peace', { locale: 'ru' })).toBe(false);

  // non-existent locale defaults to english validation.
  expect(validate('peace', { locale: 'blah' })).toBe(true);
  expect(validate('اين اشيائي', { locale: 'blah' })).toBe(false); // non english characters.
});
