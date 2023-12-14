import validate from '../src/email';

test('validates that the string is a valid email address', () => {
  expect(validate('someone@example.com')).toBe(true);
  expect(validate('someone@example.co')).toBe(true);
  expect(validate('someone123@example.co.uk')).toBe(true);
  expect(validate('very.common@example.com')).toBe(true);
  expect(validate('other.email-with-dash@example.com')).toBe(true);
  expect(validate('disposable.style.email.with+symbol@example.com')).toBe(true);
  expect(validate(['someone@example.com', 'someone12@example.com'])).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate(null)).toBe(true);
  expect(validate('')).toBe(true);
  expect(validate([])).toBe(true);

  // invalid
  expect(validate('Pelé@example.com')).toBe(false);
  expect(validate('@example.com')).toBe(false);
  expect(validate('@example')).toBe(false);
  expect(validate('undefined')).toBe(false);
  expect(validate('null')).toBe(false);
  expect(validate('someone@example.c')).toBe(false);
  expect(validate(['someone@example.com', 'someone@example.c'])).toBe(false);
});
