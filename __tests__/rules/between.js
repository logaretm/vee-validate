import validate from './../../src/rules/between';

const valid = [
    '1',
    2,
    3
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
    '12a',
    0,
    4,
    -1
];

it('validates required', () => {
    const params = [1, 3]; // min: 1, max: 3
    valid.forEach(value => expect(validate(value, params)).toBe(true));

    invalid.forEach(value => expect(validate(value, params)).toBe(false));
});
