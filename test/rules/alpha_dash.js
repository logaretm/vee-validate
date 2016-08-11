import test from 'ava';
import validate from './../../src/rules/alpha_dash';

const valid = [
    'a',
    'abcdefgHijklMnOpqRsTUVwxYZ',
    '1234567890',
    'abc123',
    123,
    '',
    null,
    undefined,
    'null',
    'undefined',
    '123-abc',
    '123_abc',
    true,
    false
];

const invalid = [
    'this is sparta',
    {},
    [],
    ' '
];

// eslint-disable-next-line
test('it validates that the string may only contain alpha-numeric characters as well as dashes and spaces', t => {
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
