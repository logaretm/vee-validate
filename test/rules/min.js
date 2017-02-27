import test from 'ava';
import validate from './../../src/rules/min';

const valid = [
    'asjdj',
    'null',
    'undefined',
    123,
    'abc'
];

const invalid = [
    1,
    12,
    undefined,
    null,
    ''
];

test('validates minimum number of characters in a string', t => {
    t.plan(10);
    const limit = 3;
    // valid.
    valid.forEach(value => t.true(validate(value, [limit])));

    // invalid
    invalid.forEach(value => t.false(validate(value, [limit])));
});
