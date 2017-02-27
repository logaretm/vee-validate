import test from 'ava';
import validate from './../../src/rules/notIn';

test('validates that the value does not exist within a list', t => {
    const list = [1, 2, 3, 4, 5];

    // valid.
    [0, 6].forEach(value => t.true(validate(value, list)));

    // invalid
    list.forEach(value => t.false(validate(value, list)));
});
