import validate from './../../src/rules/alpha_num';

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
    true,
    false
];

const invalid = [
    'this is sparta',
    '123-abc',
    {},
    [],
    ' '
];

it('validates that the string may only contain alphabetic and numeric characters', () => {
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
