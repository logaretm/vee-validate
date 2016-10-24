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

describe('collective flags checking', () => {
    it('checks if at least one field is dirty', () => {
        const bag = new FieldBag();
        bag._add('name');
        bag._add('title');

        expect(bag.dirty()).toBe(false);
        bag.setDirty('name', true);

        expect(bag.dirty()).toBe(true);
    });

    it('checks if all fields are valid', () => {
        const bag = new FieldBag();
        bag._add('name');
        bag._add('title');

        expect(bag.valid()).toBe(false);
        bag.setValid('name', true);

        expect(bag.dirty()).toBe(false);
        bag.setValid('title', true);
        expect(bag.valid()).toBe(true);
    });

    it('checks if all fields are clean', () => {
        const bag = new FieldBag();
        bag._add('name');
        bag._add('title');

        expect(bag.clean()).toBe(true);
        bag.setDirty('name', true);

        expect(bag.clean()).toBe(false);
    });

    it('checks if at least one field has failed validation', () => {
        const bag = new FieldBag();
        bag._add('name');
        bag._add('title');

        expect(bag.failed()).toBe(false); // initial state.
        bag.setDirty('name', true);
        bag.setValid('name', false);

        expect(bag.failed()).toBe(true);
    });

    it('checks if all fields has passed the validation', () => {
        const bag = new FieldBag();
        bag._add('name');
        bag._add('title');

        expect(bag.failed()).toBe(false); // initial state.
        bag.setDirty('name', true);
        bag.setValid('name', true);

        expect(bag.passed()).toBe(false);
        bag.setDirty('title', true);
        bag.setValid('title', true);

        expect(bag.passed()).toBe(true);
    });
});

it('resets the flags state for a field', () => {
    const bag = new FieldBag();
    bag._add('name');
    expect(bag.valid('name')).toBe(false);
    expect(bag.passed('name')).toBe(false);
    expect(bag.failed('name')).toBe(false);
    expect(bag.clean('name')).toBe(true);
    bag._setFlags('name', { valid: false, dirty: true });

    expect(bag.valid('name')).toBe(false);
    expect(bag.passed('name')).toBe(false);
    expect(bag.failed('name')).toBe(true);
    expect(bag.clean('name')).toBe(false);

    bag.reset('name');

    expect(bag.valid('name')).toBe(false);
    expect(bag.passed('name')).toBe(false);
    expect(bag.failed('name')).toBe(false);
    expect(bag.clean('name')).toBe(true);
});


it('resets the flags state for all fields', () => {
    const bag = new FieldBag();
    bag._add('name');
    bag._add('title');

    bag._setFlags('name', { valid: false, dirty: true });
    bag._setFlags('title', { valid: false, dirty: true });

    bag.reset();

    expect(bag.valid('name')).toBe(false);
    expect(bag.passed('name')).toBe(false);
    expect(bag.failed('name')).toBe(false);
    expect(bag.clean('name')).toBe(true);

    expect(bag.valid('title')).toBe(false);
    expect(bag.passed('title')).toBe(false);
    expect(bag.failed('title')).toBe(false);
    expect(bag.clean('title')).toBe(true);
});
