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

it('validates that the string may only contain alphabetic characters and spaces', () => {
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
