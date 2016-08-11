import test from 'ava';
import validate from './../../src/rules/alpha';

const valid = [
    'abcdefgHijklMnOpqRsTUVwxYZ',
    '',
    null,
    undefined,
    'null',
    'undefined',
    true,
    false
];

const invalid = [
    'this is sparta',
    '1234567a89',
    {},
    [],
    ' '
];

test('it validates that the string may only contains alphabetic characters', t => {
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
