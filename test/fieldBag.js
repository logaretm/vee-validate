import test from 'ava';
import FieldBag from '../src/fieldBag';

test('it adds fields to the internal bag', t => {
    const bag = new FieldBag();
    bag._add('name');

    t.truthy(bag.fields.name.clean);
});

test('it traps access and returns empty object if field does not exist', t => {
    const bag = new FieldBag();

    t.truthy(bag.fields.name);
});

test('it removes fields from the internal bag', t => {
    const bag = new FieldBag();
    bag._add('name');
    t.truthy(bag.fields.name.clean);

    bag._remove('name');
    t.falsy(bag.fields.name.clean);
});

test('it sets the dirty flag along with other dependant flags', t => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { dirty: true });
    t.true(bag.fields.name.dirty);
    t.false(bag.fields.name.clean);
    t.true(bag.fields.name.failed);
    t.false(bag.fields.name.passed);

    bag._setFlags('name', { valid: true });
    t.false(bag.fields.name.failed);
    t.true(bag.fields.name.passed);
});

test('it sets the flag along with other dependant flags', t => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { dirty: true });
    t.true(bag.fields.name.dirty);
    t.false(bag.fields.name.clean);
    t.true(bag.fields.name.failed);
    t.false(bag.fields.name.passed);

    bag._setFlags('name', { valid: true });
    t.false(bag.fields.name.failed);
    t.true(bag.fields.name.passed);
});

test('it adds the field when setting flags flags if the field does not exist', t => {
    const bag = new FieldBag();

    bag._setFlags('name', { dirty: true });
    t.true(bag.fields.name.dirty);

    bag._setFlags('name', { valid: true });
    t.true(bag.fields.name.valid);
});

test('it does not allow adding new flags', t => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { flag: true });
    t.false(bag.fields.name.dirty);
    t.true(bag.fields.name.clean);
    t.false(bag.fields.name.failed);
    t.false(bag.fields.name.passed);
    t.falsy(bag.fields.name.flag);
});
