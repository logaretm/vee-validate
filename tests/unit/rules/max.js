import validate from './../../../src/rules/max';

const valid = [
    123,
    'abc',
    1,
    12,
    undefined,
    null,
    ''
];

const invalid = [
    'abcde',
    'null',
    'undefined'
];

test('validates maximum number of characters in a string', () => {
    expect.assertions(10);
    const limit = 3;

    // valid.
    valid.forEach(value => expect(validate(value, [limit])).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value, [limit])).toBe(false));
});
