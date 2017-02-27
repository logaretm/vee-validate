import test from 'ava';
import validate from './../../src/rules/max';

const valid = [
    123,
    'abc',
    1,
    12,
    undefined,
    null,
    ''
];

const invalid = [
    'abcde',
    'null',
    'undefined'
];

test('validates maximum number of characters in a string', t => {
    t.plan(10);
    const limit = 3;

    // valid.
    valid.forEach(value => t.true(validate(value, [limit])));

    // invalid
    invalid.forEach(value => t.false(validate(value, [limit])));
});
