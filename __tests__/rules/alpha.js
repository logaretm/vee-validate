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

it('validates that the string may only contains alphabetic characters', () => {
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
