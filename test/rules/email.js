import test from 'ava';
import validate from './../../src/rules/email';

const valid = [
    'someone@example.com',
    'someone@example.co',
    'someone123@example.co.uk',
    'Pelé@example.com',
    'very.common@example.com',
    'other.email-with-dash@example.com',
    'disposable.style.email.with+symbol@example.com'
];

const invalid = [
    '@example.com',
    '@example',
    undefined,
    null,
    'undefined',
    'null',
    'someone@example.c',
];

test('validates that the string is a valid email address', t => {
    t.plan(14);
    // valid.
    valid.forEach(value => t.true(validate(value)));

    // invalid
    invalid.forEach(value => t.false(validate(value)));
});
