import validate from './../../../src/rules/notIn';

test('validates that the value does not exist within a list', () => {
    const list = [1, 2, 3, 4, 5];

    // valid.
    [0, 6].forEach(value => expect(validate(value, list)).toBe(true));
    expect(validate([6], list)).toBe(true);

    // invalid
    list.forEach(value => expect(validate(value, list)).toBe(false));
    expect(validate([1, 2, 3], list)).toBe(false);
});
