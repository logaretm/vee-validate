import test from 'ava';
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

test('it validates that the string is a valid ipv4 address', t => {
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
