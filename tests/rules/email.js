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

test('validates that the string is a valid email address', () => {
    expect.assertions(14);
    // valid.
    valid.forEach(value => expect(validate(value)).toBe(true));

    // invalid
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
