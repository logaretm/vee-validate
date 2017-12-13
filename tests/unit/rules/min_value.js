import validate from './../../../src/rules/min_value';

const valid = [
    -1,
    0,
    '5'
];

const invalid = [
    '',
    [],
    undefined,
    null,
    {},
    'abc',
    -2,
    '-3'
];

test('validates number minimum value', () => {
    expect.assertions(11);
    const min = -1;

    // valid
    valid.forEach(value => expect(validate(value, [min])).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value, [min])).toBe(false));
});
