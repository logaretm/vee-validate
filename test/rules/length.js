import test from 'ava';
import validate from './../../src/rules/length';

const valid = [
    'abcde',
    12345
];

const invalid = [
    1,
    12,
    undefined,
    null,
    '1',
    'abc',
    '123456',
    'abcdefg',
    123456
];

test('validates exact number of characters in a string', t => {
    t.plan(11);
    const length = 5;
    // valid
    valid.forEach(value => t.true(validate(value, [length])));

    // invalid
    invalid.forEach(value => t.false(validate(value, [length])));
});
