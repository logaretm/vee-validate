import validate from '../src/required_if';

test('validates required_if with array params', () => {
  // target has a matching value, field is empty -> invalid
  expect(validate('', ['Online Banking', 'Online Banking'])).toBe(false);
  expect(validate(null, ['Online Banking', 'Online Banking'])).toBe(false);
  expect(validate(undefined, ['Online Banking', 'Online Banking'])).toBe(false);
  expect(validate([], ['Online Banking', 'Online Banking'])).toBe(false);

  // target has a matching value, field is filled -> valid
  expect(validate('Nabil', ['Online Banking', 'Online Banking'])).toBe(true);

  // target does not match any value, field is empty -> valid (not required)
  expect(validate('', ['Cash', 'Online Banking'])).toBe(true);
  expect(validate(null, ['Cash', 'Online Banking'])).toBe(true);
  expect(validate(undefined, ['Cash', 'Online Banking'])).toBe(true);
});

test('validates required_if with object params', () => {
  // target matches, field is empty -> invalid
  expect(validate('', { target: 'Online Banking', values: ['Online Banking'] })).toBe(false);

  // target matches, field is filled -> valid
  expect(validate('Nabil', { target: 'Online Banking', values: ['Online Banking'] })).toBe(true);

  // target does not match, field is empty -> valid
  expect(validate('', { target: 'Cash', values: ['Online Banking'] })).toBe(true);
});

test('validates required_if with multiple comparison values', () => {
  // target matches one of the values
  expect(validate('', ['Online Banking', 'Online Banking', 'Wire Transfer'])).toBe(false);
  expect(validate('', ['Wire Transfer', 'Online Banking', 'Wire Transfer'])).toBe(false);
  expect(validate('Nabil', ['Online Banking', 'Online Banking', 'Wire Transfer'])).toBe(true);

  // target matches none
  expect(validate('', ['Cash', 'Online Banking', 'Wire Transfer'])).toBe(true);
});

test('validates required_if without comparison values (truthy target)', () => {
  // target is truthy, no comparison values -> field is required
  expect(validate('', ['some value'])).toBe(false);
  expect(validate('filled', ['some value'])).toBe(true);

  // target is empty/falsy, no comparison values -> field is not required
  expect(validate('', [''])).toBe(true);
  expect(validate('', [null])).toBe(true);
  expect(validate('', [undefined])).toBe(true);
});

test('validates required_if with object params and no values array', () => {
  // target is truthy -> required
  expect(validate('', { target: 'truthy' })).toBe(false);
  expect(validate('filled', { target: 'truthy' })).toBe(true);

  // target is falsy -> not required
  expect(validate('', { target: '' })).toBe(true);
  expect(validate('', { target: null })).toBe(true);
  expect(validate('', { target: undefined })).toBe(true);
});

test('uses loose equality for value comparison', () => {
  // '1' == 1 should be true with loose equality
  expect(validate('', ['1', 1])).toBe(false);
  expect(validate('', [1, '1'])).toBe(false);
});
