import test from 'ava';
import validate from './../../src/rules/numeric';

const valid = [
    '1234567890',
    123
];

const invalid = [
    'a',
    '1234567a89',
    null,
    undefined,
    true,
    false,
    {},
    []
];

test('it validates that the string only contains numeric characters', t => {
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
