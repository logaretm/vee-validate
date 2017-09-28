import mapFields from '../src/core/helpers';

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

describe('the mapped function resolves the field flags object', () => {
  const fields = mapFields({
    email: 'email',
    phone: 'scoped.phone',
    multiple: 'multiple.dotted.field.name',
    dotted: 'scoped.dotted.name',
    invalid: 'non-existent-field',
    invalidScoped: 'scoped.non-existent-scoped-field'
  });

  const makeContext = () => ({
    $validator: {
      flags: {
        email: { valid: 'email' },
        $scoped: {
          phone: { valid: 'phone' },
          'dotted.name': { valid: 'dotted' }
        },
        'multiple.dotted.field.name': { valid: 'multiple' } 
      }
    }
  });

  test('if field has root level', () => {
    const context = makeContext();
    const result = fields.email.call(context, null);
    expect(result).toEqual({
      valid: 'email'
    });
  });

  test('if field has scope level', () => {
    const context = makeContext();
    const result = fields.phone.call(context, null);
    expect(result).toEqual({
      valid: 'phone'
    });
  });

  test('if field has multiple dots in its name', () => {
    const context = makeContext();
    // when its root.
    let result = fields.multiple.call(context, null);
    expect(result).toEqual({
      valid: 'multiple'
    });

    // when its actually scoped.
    result = fields.dotted.call(context, null);
    expect(result).toEqual({
      valid: 'dotted'
    });
  });

  test('if root level field does not exist', () => {
    const context = makeContext();
    const result = fields.invalid.call(context, null);
    expect(result).toEqual({});
  });

  test('if scope level field does not exist', () => {
    const context = makeContext();
    const result = fields.invalidScoped.call(context, null);
    expect(result).toEqual({});
  });
});
