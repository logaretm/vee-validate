import test from 'ava';
import validate from './../../src/rules/decimal';

test('validates numerics with decmial numbers', t => {
    const params = [2];

    t.true(validate(''));
    t.true(validate('11.223123818'));
    t.true(validate('11.223123818', []));
    t.true(validate('11.223123818', null));
    t.true(validate('11.223123818', undefined));
    t.true(validate('11.223123818', [null]));
    t.true(validate('11.223123818', [undefined]));
    t.true(validate('11.2', params));
    t.true(validate('11.23', params));
    t.true(validate('-1', params));
    t.true(validate('11', params));
    t.true(validate('.11'));
    t.true(validate('1', ['0']));

    t.false(validate('11.234', params));
    t.false(validate('1-', params));
    t.false(validate('1-1', params));
    t.false(validate('1-1.22', params));
    t.false(validate([]));
    t.false(validate('a'));
    t.false(validate('1.11', ['0']));
});
