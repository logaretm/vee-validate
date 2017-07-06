import mapFields from '../src/helpers';

test('it maps field names from array to object of functions', () => {
  const fields = mapFields(['email', 'name', 'scoped.phone']);

  expect(typeof fields.email === 'function').toBe(true);
  expect(typeof fields.name === 'function').toBe(true);
  expect(typeof fields.phone === 'function').toBe(true); // no special treatment for scoped fields.
});

test('it maps field names to new names from objects', () => {
  const fields = mapFields({
    email: 'email',
    fullname: 'name',
    phone: 'scoped.phone'
  });

  expect(typeof fields.email === 'function').toBe(true);
  expect(typeof fields.fullname === 'function').toBe(true);
  expect(typeof fields.phone === 'function').toBe(true); // no special treatment for scoped fields.
});
