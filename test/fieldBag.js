import test from 'ava';
import FieldBag from '../src/fieldBag';

test('adds fields to the internal bag', t => {
  const bag = new FieldBag();
  bag._add('name');

  t.truthy(bag.clean('name'));
});

test('returns a false flag for non-existant fields', t => {
  const bag = new FieldBag();

  t.false(bag.clean('name'));
  t.false(bag.dirty('name'));
  t.false(bag.valid('name'));
});

test('removes fields from the internal bag', t => {
  const bag = new FieldBag();
  bag._add('name');
  t.true(bag.clean('name'));

  bag._remove('name');
  t.false(bag.clean('name'));
});

test('sets dirty and valid flags along with other dependant flags', t => {
  const bag = new FieldBag();
  bag._add('name');

  bag._setFlags('name', { dirty: true });
  t.true(bag.dirty('name'));
  t.false(bag.clean('name'));
  t.true(bag.failed('name'));
  t.false(bag.passed('name'));

  bag._setFlags('name', { valid: true });
  t.false(bag.failed('name'));
  t.true(bag.passed('name'));
});

test('does not allow adding new flags', t => {
  const bag = new FieldBag();
  bag._add('name');

  t.false(bag._setFlags('name', { flag: true }));
});

test('checks if at least one field is dirty', t => {
    const bag = new FieldBag();
    bag._add('name');
    bag._add('title');

    t.false(bag.dirty());
    bag.setDirty('name', true);

    t.true(bag.dirty());
});

test('checks if all fields are valid', t => {
    const bag = new FieldBag();
    bag._add('name');
    bag._add('title');

    t.false(bag.valid());
    bag.setValid('name', true);

    t.false(bag.dirty());
    bag.setValid('title', true);
    t.true(bag.valid());
});

test('checks if all fields are clean', t => {
  const bag = new FieldBag();
  bag._add('name');
  bag._add('title');

  t.true(bag.clean());
  bag.setDirty('name', true);

  t.false(bag.clean());
});

test('checks if at least one field has failed validation', t => {
  const bag = new FieldBag();
  bag._add('name');
  bag._add('title');

  t.false(bag.failed()); // initial state.
  bag.setDirty('name', true);
  bag.setValid('name', false);

  t.true(bag.failed());
});

test('checks if all fields has passed the validation', t => {
  const bag = new FieldBag();
  bag._add('name');
  bag._add('title');

  t.false(bag.failed()); // initial state.
  bag.setDirty('name', true);
  bag.setValid('name', true);

  t.false(bag.passed());
  bag.setDirty('title', true);
  bag.setValid('title', true);

  t.true(bag.passed());
});

test('resets the flags state for a field', t => {
  const bag = new FieldBag();
  bag._add('name');
  t.false(bag.valid('name'));
  t.false(bag.passed('name'));
  t.false(bag.failed('name'));
  t.true(bag.clean('name'));
  bag._setFlags('name', { valid: false, dirty: true });

  t.false(bag.valid('name'));
  t.false(bag.passed('name'));
  t.true(bag.failed('name'));
  t.false(bag.clean('name'));

  bag.reset('name');

  t.false(bag.valid('name'));
  t.false(bag.passed('name'));
  t.false(bag.failed('name'));
  t.true(bag.clean('name'));
});

test('resets the flags state for all fields', t => {
  const bag = new FieldBag();
  bag._add('name');
  bag._add('title');

  bag._setFlags('name', { valid: false, dirty: true });
  bag._setFlags('title', { valid: false, dirty: true });

  bag.reset();

  t.false(bag.valid('name'));
  t.false(bag.passed('name'));
  t.false(bag.failed('name'));
  t.true(bag.clean('name'));

  t.false(bag.valid('title'));
  t.false(bag.passed('title'));
  t.false(bag.failed('title'));
  t.true(bag.clean('title'));
});
