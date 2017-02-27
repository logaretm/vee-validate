import test from 'ava';
import validate from './../../src/rules/between';

const valid = [
    '1',
    2,
    3
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
    '12a',
    0,
    4,
    -1
];

test('validates numbers range', t => {
    t.plan(15);
    const params = [1, 3]; // min: 1, max: 3
    valid.forEach(value => t.true(validate(value, params)));

    invalid.forEach(value => t.false(validate(value, params)));
});

test('validates numbers range including negative numbers', t => {
    const range = [-10, 1];
    t.true(validate(0, range));
    t.true(validate('-9', range));
});
