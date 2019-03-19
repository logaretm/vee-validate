import { validate } from '@/rules/json';

const valid = [
  '[1,"value",{"key":"value"}]',
  '{"key":"value"}',
  '[{"key":"value"},{"key":"value"}]',
  [
    '[1,"value",{"key":"value"}]',
    '{"key":"value"}',
    '[{"key":"value"},{"key":"value"}]'
  ]
];

const invalid = [
  '[1,value,{key:value}]',
  '{key:value}',
  '[{key:value},key:value}]',
  [
    '[1,value",{key":"value"}]',
    '{"key":"value"}',
    '[{"key":value},{"key":"value"}]'
  ],
  undefined,
  null
];

test('validates that the string is a valid json', () => {
  expect.assertions(10);
  // valid.
  valid.forEach(value => expect(validate(value)).toBe(true));

  // invalid
  invalid.forEach(value => expect(validate(value)).toBe(false));
});

test('validates json (array)', () => {
  const valid = '[1,"value",{"key":"value"}]';
  expect(validate(valid, { type: 'array' })).toBe(true);

  const invalid = '{"key":"value"}';
  expect(validate(invalid, { type: 'array' })).toBe(false);
});

test('validates json (array_object)', () => {
  const valid = '[{"key":"value"},{"key":"value"}]';
  expect(validate(valid, { type: 'array_object' })).toBe(true);

  const invalid = '[1,"value",{"key":"value"}]';
  expect(validate(invalid, { type: 'array_object' })).toBe(false);

  const invalid2 = '{"key":"value"}';
  expect(validate(invalid2, { type: 'array_object' })).toBe(false);
});

test('validates json (object)', () => {
  const valid = '{"key":"value"}';
  expect(validate(valid, { type: 'object' })).toBe(true);

  const invalid = '[1,"value",{"key":"value"}]';
  expect(validate(invalid, { type: 'object' })).toBe(false);
});
