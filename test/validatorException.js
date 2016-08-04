import test from 'ava';
import ValidatorException from './../src/exceptions/validatorException';

test('it can be converted to a string', t => {
    const ex = new ValidatorException('Something went wrong.');

    t.is(String(ex), 'Something went wrong.');
});
