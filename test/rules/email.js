import test from 'ava';
import validate from './../../src/rules/email';

const valid = [
    'someone@example.com',
    'someone@example.co',
    'someone123@example.co.uk',
];

const invalid = [
    '@example.com',
    '@example',
    undefined,
    null,
    'undefined',
    'null',
    'someone#@example.co.uk',
];

test('it validates that the string is a valid email address', t => {
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
