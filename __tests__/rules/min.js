import validate from './../../src/rules/min';

const valid = [
    'asjdj',
    'null',
    'undefined',
    123,
    'abc'
];

const invalid = [
    1,
    12,
    undefined,
    null,
    ''
];

it('validates minimum number of characters in a string', () => {
    const limit = 3;
    // valid.
    valid.forEach(value => expect(validate(value, [limit])).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value, [limit])).toBe(false));
});
