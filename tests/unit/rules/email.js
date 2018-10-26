import { validate } from '@/rules/email';

const valid = [
  'someone@example.com',
  'someone@example.co',
  'someone123@example.co.uk',
  'Pelé@example.com',
  'very.common@example.com',
  'other.email-with-dash@example.com',
  'disposable.style.email.with+symbol@example.com',
  ['someone@example.com', 'someone12@example.com']
];

const invalid = [
  '@example.com',
  '@example',
  undefined,
  null,
  'undefined',
  'null',
  'someone@example.c',
  ['someone@example.com', 'someone@example.c']
];

test('validates that the string is a valid email address', () => {
  expect.assertions(16);
  // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('validates multiple emails', () => {
  const validList = 'emaisadasdl@gmail.com, myemasdasdadail@gmail.com, woasdadadaw@email.com';
  expect(validate(validList, { multiple: true })).toBe(true);

  const invalidList = 'emaadasdasdil@gmail.com, myemdasdasdadail@gmail.c, woasdasdasw@email.com';
  expect(validate(invalidList, { multiple: true })).toBe(false);
});
