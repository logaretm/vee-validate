import test from 'ava';
import validate from './../../src/rules/alpha_spaces';

const valid = [
    'a',
    'abcdefgHijklMnOpqRsTUVwxYZ',
    '',
    null,
    undefined,
    'null',
    'undefined',
    true,
    false,
    'this is sparta',
    ' '
];

const invalid = [
    '123-abc',
    {},
    '1234567890',
    'abc123',
    123
];

test('validates that the string may only contain alphabetic characters and spaces', t => {
    t.plan(16);
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
