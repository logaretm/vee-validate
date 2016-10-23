import FieldBag from '../src/fieldBag';

it('adds fields to the internal bag', () => {
    const bag = new FieldBag();
    bag._add('name');

    expect(bag.clean('name')).toBeTruthy();
});

it('returns a false flag for non-existant fields', () => {
    const bag = new FieldBag();

    expect(bag.clean('name')).toBe(false);
    expect(bag.dirty('name')).toBe(false);
    expect(bag.valid('name')).toBe(false);
});

it('removes fields from the internal bag', () => {
    const bag = new FieldBag();
    bag._add('name');
    expect(bag.clean('name')).toBe(true);

    bag._remove('name');
    expect(bag.clean('name')).toBe(false);
});

it('sets dirty and valid flags along with other dependant flags', () => {
    const bag = new FieldBag();
    bag._add('name');

    bag._setFlags('name', { dirty: true });
    expect(bag.dirty('name')).toBe(true);
    expect(bag.clean('name')).toBe(false);
    expect(bag.failed('name')).toBe(true);
    expect(bag.passed('name')).toBe(false);

    bag._setFlags('name', { valid: true });
    expect(bag.failed('name')).toBe(false);
    expect(bag.passed('name')).toBe(true);
});

it('does not allow adding new flags', () => {
    const bag = new FieldBag();
    bag._add('name');

    expect(bag._setFlags('name', { flag: true })).toBe(false);
});
