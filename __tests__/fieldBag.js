import FieldBag from '../src/fieldBag';

it('adds fields to the internal bag', () => {
    const bag = new FieldBag();
    bag._add('name');

    expect(bag.fields.name.clean).toBeTruthy();
});

it('traps access and returns empty object if field does not exist', () => {
    const bag = new FieldBag();

    expect(bag.fields.name).toBeTruthy();
});

it('removes fields from the internal bag', () => {
    const bag = new FieldBag();
    bag._add('name');
    expect(bag.fields.name.clean).toBeTruthy();

    bag._remove('name');
    expect(bag.fields.name.clean).toBeFalsy();
});

it('sets the dirty flag along with other dependant flags', () => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { dirty: true });
    expect(bag.fields.name.dirty).toBe(true);
    expect(bag.fields.name.clean).toBe(false);
    expect(bag.fields.name.failed).toBe(true);
    expect(bag.fields.name.passed).toBe(false);

    bag._setFlags('name', { valid: true });
    expect(bag.fields.name.failed).toBe(false);
    expect(bag.fields.name.passed).toBe(true);
});

it('sets the flag along with other dependant flags', () => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { dirty: true });
    expect(bag.fields.name.dirty).toBe(true);
    expect(bag.fields.name.clean).toBe(false);
    expect(bag.fields.name.failed).toBe(true);
    expect(bag.fields.name.passed).toBe(false);

    bag._setFlags('name', { valid: true });
    expect(bag.fields.name.failed).toBe(false);
    expect(bag.fields.name.passed).toBe(true);
});

it('adds the field when setting flags flags if the field does not exist', () => {
    const bag = new FieldBag();

    bag._setFlags('name', { dirty: true });
    expect(bag.fields.name.dirty).toBe(true);

    bag._setFlags('name', { valid: true });
    expect(bag.fields.name.valid).toBe(true);
});

it('does not allow adding new flags', () => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { flag: true });
    expect(bag.fields.name.dirty).toBe(false);
    expect(bag.fields.name.clean).toBe(true);
    expect(bag.fields.name.failed).toBe(false);
    expect(bag.fields.name.passed).toBe(false);
    expect(bag.fields.name.flag).toBeFalsy();
});
