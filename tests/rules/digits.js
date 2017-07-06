import validate from './../../src/rules/digits';

const valid = [
    '123',
    '456',
    '789',
    '012'
];

const invalid = [
    '',
    [],
    undefined,
    null,
    {},
    '1234',
    '12',
    'abc',
    '12a'
];

test('validates required', () => {
    expect.assertions(13);
    const params = [3]; // 3 digits only.
    valid.forEach(value => expect(validate(value, params)).toBe(true));

    invalid.forEach(value => expect(validate(value, params)).toBe(false));
});
