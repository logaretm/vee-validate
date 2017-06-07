import test from 'ava';
import ValidatorException from './../src/exceptions/validatorException';

test('exception messages are branded by the plugin name', t => {
  const ex = new ValidatorException('Something went wrong.');
  t.is(ex.message, '[vee-validate]: Something went wrong.');
});
