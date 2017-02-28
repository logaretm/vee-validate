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
    [],
    '+123',
    '-123'
];

test('validates that the string only contains numeric characters', t => {
    t.plan(12);
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
