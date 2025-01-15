import validate from '../src/alpha_num';

test('validates that the string may only contain alphabetic and numeric characters', () => {
  expect(validate('a', [undefined])).toBe(true);
  expect(validate('abcdefgHijklMnOpqRsTUVwxYZ', [undefined])).toBe(true);
  expect(validate('1234567890', [undefined])).toBe(true);
  expect(validate('abc123', [undefined])).toBe(true);
  expect(validate(123, [undefined])).toBe(true);
  expect(validate('', [undefined])).toBe(true);
  expect(validate(null, [undefined])).toBe(true);
  expect(validate(undefined, [undefined])).toBe(true);
  expect(validate('null', [undefined])).toBe(true);
  expect(validate('undefined', [undefined])).toBe(true);
  expect(validate(true, [undefined])).toBe(true);
  expect(validate(false, [undefined])).toBe(true);
  expect(validate(['asdad', 123, 'asd2123'], [undefined])).toBe(true);

  expect(validate('this is sparta', [undefined])).toBe(false);
  expect(validate('123-abc', [undefined])).toBe(false);
  expect(validate({}, [undefined])).toBe(false);
  expect(validate(' ', [undefined])).toBe(false);
  expect(validate(['asdasda  ', '123 ad'], [undefined])).toBe(false);
});

test('validates the string contains alphabetic chars from other locales', () => {
  // any locale.
  expect(validate('سلام12', [undefined])).toBe(true);
  expect(validate('Привет12', [undefined])).toBe(true);

  // specific locale
  expect(validate('peace', { locale: 'ar' })).toBe(false);
  expect(validate('peace', { locale: 'ru' })).toBe(false);

  // non-existent locale defaults to english validation.
  expect(validate('peace', { locale: 'blah' })).toBe(true);
  expect(validate('اين اشيائي', { locale: 'blah' })).toBe(false); // non english characters.
});
