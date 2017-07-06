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

test('validates that the string only contains numeric characters', () => {
    expect.assertions(12);
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
