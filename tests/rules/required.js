import { validate } from '@/rules/required';

const valid = ['asjdj', 0, 'undefined', 'null', 's ', true, false];

const invalid = ['', ' ', [], undefined, null];

test('validates required', () => {
  expect.assertions(12);
  valid.forEach(value => expect(validate(value).valid).toBe(true));

  invalid.forEach(value => expect(validate(value).valid).toBe(false));
});

test('false value can be invalidated', () => {
  expect(validate(false).valid).toBe(true);
  expect(validate(false, { allowFalse: false }).valid).toBe(false);
});
