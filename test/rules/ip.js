import test from 'ava';
import validate from './../../src/rules/ip';

test('validates that the string is a valid ipv4 address', t => {
    // valid.
    ['192.168.1.1', '255.255.255.255'].forEach(value => t.true(validate(value)));

    // invalid
    ['192.168.a.1', '255.255.255.256', '23.a.f.234'].forEach(value => t.false(validate(value)));
});

test('validates that the string is a valid ipv6 address', t => {
    // valid.
    [
        '::1',
        '2001:db8:0000:1:1:1:1:1',
        '::ffff:127.0.0.1'
    ].forEach(value => t.true(validate(value, [6])));

    // invalid
    [
        '127.0.0.1',
        '0.0.0.0',
        '255.255.255.255',
        '1.2.3.4',
        '::ffff:287.0.0.1',
    ].forEach(value => t.false(validate(value, [6])));
});
