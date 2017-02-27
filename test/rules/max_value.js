import test from 'ava';
import validate from './../../src/rules/max_value';

const valid = [
    0,
    '1',
    10
];

const invalid = [
    '',
    10.01,
    11,
    [],
    undefined,
    null,
    {},
    'abc'
];

test('validates number maximum value', t => {
    t.plan(11);
    const max = 10;

    // valid.
    valid.forEach(value => t.true(validate(value, [max])));

    // invalid
    invalid.forEach(value => t.false(validate(value, [max])));
});
