import test from 'ava';
import validate from './../../src/rules/in';

test('validates that the value exists within a list', t => {
    const list = [1, 2, 3, 4, 5];

    // valid.
    list.forEach(value => t.true(validate(value, list)));

    // invalid
    [0, 6].forEach(value => t.false(validate(value, list)));
});
