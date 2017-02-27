import test from 'ava';
import validate from './../../src/rules/required';

const valid = [
    'asjdj',
    0,
    'undefined',
    'null',
    's '
];

const invalid = [
    '',
    ' ',
    [],
    undefined,
    null
];

test('validates required', t => {
    t.plan(10);
    valid.forEach(value => t.true(validate(value)));

    invalid.forEach(value => t.false(validate(value)));
});
