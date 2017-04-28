import test from 'ava';
import mapFields from '../src/helpers';

test('it maps field names from array to object of functions', t => {
  const fields = mapFields(['email', 'name', 'scoped.phone']);

  t.true(typeof fields.email === 'function');
  t.true(typeof fields.name === 'function');
  t.true(typeof fields.phone === 'function'); // no special treatment for scoped fields.
});

test('it maps field names to new names from objects', t => {
  const fields = mapFields({
    email: 'email',
    fullname: 'name',
    phone: 'scoped.phone'
  });

  t.true(typeof fields.email === 'function');
  t.true(typeof fields.fullname === 'function');
  t.true(typeof fields.phone === 'function'); // no special treatment for scoped fields.
});
