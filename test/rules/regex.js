import test from 'ava';
import validate from './../../src/rules/regex';

test('validates regular expressions', t => {
    const numbers = [/^[0-9]+$/];
    t.true(validate('1234567890', numbers));
    t.false(validate('abc', numbers));
    t.false(validate('abc-123', numbers));
    t.false(validate('1234abc5', numbers));
    t.false(validate('', numbers));
});

test('validates with strings as regular expressions', t => {
    const numbers = ['^[0-9]+$'];
    t.true(validate('1234567890', numbers));
    t.false(validate('abc', numbers));
    t.false(validate('abc-123', numbers));
    t.false(validate('1234abc5', numbers));
    t.false(validate('', numbers));
});
