import validate from './../../src/rules/decimal';

it('validates numerics with decmial numbers', () => {
    const params = [2];

    expect(validate('')).toBe(true);
    expect(validate('11.223123818')).toBe(true);
    expect(validate('11.2', params)).toBe(true);
    expect(validate('11.23', params)).toBe(true);
    expect(validate('-1', params)).toBe(true);
    expect(validate('11', params)).toBe(true);
    expect(validate('.11')).toBe(true);

    expect(validate('11.234', params)).toBe(false);
    expect(validate('1-', params)).toBe(false);
    expect(validate('1-1', params)).toBe(false);
    expect(validate('1-1.22', params)).toBe(false);
    expect(validate([])).toBe(false);
    expect(validate('a')).toBe(false);
});
