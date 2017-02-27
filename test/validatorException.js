import test from 'ava';
import ValidatorException from './../src/exceptions/validatorException';

test('can be converted to a string', t => {
  const ex = new ValidatorException('Something went wrong.');
  t.is(String(ex), '[vee-validate]: Something went wrong.');
});
