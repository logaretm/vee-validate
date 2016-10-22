import validate from './../../src/rules/ip';

const valid = [
    '192.168.1.1',
    '255.255.255.255'
];

const invalid = [
    '192.168.a.1',
    '255.255.255.256',
    '23.a.f.234'
];

it('validates that the string is a valid ipv4 address', () => {
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
