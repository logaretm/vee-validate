import test from 'ava';
import validate from './../../src/rules/required';

const valid = [
    'asjdj',
    0,
    'undefined',
    'null'
];

const invalid = [
    '',
    [],
    undefined,
    null
];

test('it validates required', t => {
    valid.forEach(value => t.true(validate(value)));

    invalid.forEach(value => t.false(validate(value)));
});
