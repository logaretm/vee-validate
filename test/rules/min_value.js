import test from 'ava';
import validate from './../../src/rules/min_value';

const valid = [
    -1,
    0,
    '5'
];

const invalid = [
    '',
    [],
    undefined,
    null,
    {},
    'abc',
    -2,
    '-3'
];

test('validates number minimum value', t => {
    t.plan(11);
    const min = -1;

    // valid
    valid.forEach(value => t.true(validate(value, [min])));

    // invalid
    invalid.forEach(value => t.false(validate(value, [min])));
});
