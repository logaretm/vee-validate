import test from 'ava';
import validate from './../../src/rules/required';

const valid = [
  'asjdj',
  0,
  'undefined',
  'null',
  's ',
  true
];

const invalid = [
  '',
  ' ',
    [],
  undefined,
  null,
  false
];

test('validates required', t => {
  t.plan(12);
  valid.forEach(value => t.true(validate(value)));

  invalid.forEach(value => t.false(validate(value)));
});
