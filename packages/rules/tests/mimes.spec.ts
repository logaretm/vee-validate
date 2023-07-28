import validate from '../src/mimes';
import helpers from './helpers';

test('validates mime types', () => {
  const params = ['image/*', 'text/plain'];

  expect(
    validate(
      [
        helpers.file('file.txt', 'text/plain'),
        helpers.file('file.jpg', 'image/jpeg'),
        helpers.file('file.svg', 'image/svg'),
      ],
      params,
    ),
  ).toBe(true);

  expect(validate(helpers.file('file.pdf', 'application/pdf'), params)).toBe(false);
});

test('mimes with regex characters', () => {
  expect(validate(helpers.file('file.svg', 'image/svg'), ['image/svg+xml'])).toBe(true);
  expect(validate(helpers.file('file.svg', 'image/xml'), ['image/svg+xml'])).toBe(false);
});
