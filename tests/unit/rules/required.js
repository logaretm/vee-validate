import validate from './../../../src/rules/required';

const valid = [
  'asjdj',
  0,
  'undefined',
  'null',
  's ',
  true,
  false
];

const invalid = [
  '',
  ' ',
    [],
  undefined,
  null
];

test('validates required', () => {
  expect.assertions(12);
  valid.forEach(value => expect(validate(value)).toBe(true));

  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('false value can be invalidated', () => {
  expect(validate(false)).toBe(true);  
  expect(validate(false, [true])).toBe(false);
});
