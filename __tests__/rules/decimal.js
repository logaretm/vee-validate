import validate from './../../src/rules/decimal';

it('validates numerics with decmial numbers', () => {
    const params = [2];

    expect(validate([])).toBe(false);
    expect(validate('a')).toBe(false);
    expect(validate('')).toBe(true);
    expect(validate('11')).toBe(true);
    expect(validate('.11')).toBe(true);
    expect(validate('11.223123818')).toBe(true);
    expect(validate('11.2', params)).toBe(true);
    expect(validate('11.23', params)).toBe(true);
    expect(validate('11.234', params)).toBe(false);
});
