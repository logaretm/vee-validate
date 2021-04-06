import validate from '../src/url';

test('validates url', () => {
  const validUrl = 'https://test.com:8080/en/whatever/?q=test#wow';

  // no pattern
  expect(validate(validUrl, {})).toBe(true);
  expect(validate('/only/path', {})).toBe(false);
  expect(validate('invalid', {})).toBe(false);

  // with pattern
  expect(validate(validUrl, { pattern: 'https://.*' })).toBe(true);
  expect(validate(validUrl, { pattern: /http:\/\/.*/ })).toBe(false);
  expect(validate(validUrl, ['/en/whatever/'])).toBe(true);
  expect(validate(validUrl, ['/fr/whatever/'])).toBe(false);
});
