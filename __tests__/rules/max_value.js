
import validate from './../../src/rules/max_value';

const valid = [
    0,
    '1',
    10
];

const invalid = [
    '',
    10.01,
    11,
    [],
    undefined,
    null,
    {},
    'abc'
];

it('validates number maximum value', () => {
    const max = 10;

    // valid.
    valid.forEach(value => expect(validate(value, [max])).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value, [max])).toBe(false));
});
