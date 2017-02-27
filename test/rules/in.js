import validate from './../../src/rules/in';

it('validates that the value exists within a list', () => {
    const list = [1, 2, 3, 4, 5];

    // valid.
    list.forEach(value => expect(validate(value, list)).toBe(true));

    // invalid
    [0, 6].forEach(value => expect(validate(value, list)).toBe(false));
});
