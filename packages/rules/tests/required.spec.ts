import validate from '../src/required';

const valid = ['asjdj', 0, 'undefined', 'null', 's ', true];

const invalid = ['', ' ', [], undefined, null, false];

test('validates required', () => {
  expect.assertions(12);
  valid.forEach(value => expect(validate(value)).toBe(true));

  invalid.forEach(value => expect(validate(value)).toBe(false));
});
