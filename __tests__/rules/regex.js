import validate from './../../src/rules/regex';

it('validates regular expressions', () => {
    const numbers = [/^[0-9]+$/];
    expect(validate('1234567890', numbers)).toBe(true);
    expect(validate('abc', numbers)).toBe(false);
    expect(validate('abc-123', numbers)).toBe(false);
    expect(validate('1234abc5', numbers)).toBe(false);
    expect(validate('', numbers)).toBe(false);
});

it('validates with strings as regular expressions', () => {
    const numbers = ['^[0-9]+$'];
    expect(validate('1234567890', numbers)).toBe(true);
    expect(validate('abc', numbers)).toBe(false);
    expect(validate('abc-123', numbers)).toBe(false);
    expect(validate('1234abc5', numbers)).toBe(false);
    expect(validate('', numbers)).toBe(false);
});
