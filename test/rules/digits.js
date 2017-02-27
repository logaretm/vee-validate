import test from 'ava';
import validate from './../../src/rules/digits';

const valid = [
    '123',
    '456',
    '789',
    '012'
];

const invalid = [
    '',
    [],
    undefined,
    null,
    {},
    '1234',
    '12',
    'abc',
    '12a'
];

test('validates required', t => {
    t.plan(13);
    const params = [3]; // 3 digits only.
    valid.forEach(value => t.true(validate(value, params)));

    invalid.forEach(value => t.false(validate(value, params)));
});
