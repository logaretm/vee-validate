import test from 'ava';
import validate from './../../src/rules/decimal';

test('it validates numerics with decmial numbers', t => {
    const params = [2];

    t.false(validate([]));
    t.false(validate('a'));
    t.true(validate(''));
    t.true(validate('11'));
    t.true(validate('.11'));
    t.true(validate('11.223123818'));
    t.true(validate('11.2', params));
    t.true(validate('11.23', params));
    t.false(validate('11.234', params));
});
