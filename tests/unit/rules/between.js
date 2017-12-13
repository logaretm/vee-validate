import validate from './../../../src/rules/between';

const valid = [
    '1',
    2,
    3,
    [1, 2, 3]
];

const invalid = [
    '',
    undefined,
    null,
    {},
    '1234',
    '12',
    'abc',
    '12a',
    0,
    4,
    -1,
    [4, 5, 6]
];

test('validates numbers range', () => {
    expect.assertions(16);
    const params = [1, 3]; // min: 1, max: 3
    valid.forEach(value => expect(validate(value, params)).toBe(true));

    invalid.forEach(value => expect(validate(value, params)).toBe(false));
});

test('validates numbers range including negative numbers', () => {
    const range = [-10, 1];
    expect(validate(0, range)).toBe(true);
    expect(validate('-9', range)).toBe(true);
});
