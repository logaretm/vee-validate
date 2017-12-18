import validate from './../../../src/rules/decimal';

test('validates numerics with decmial numbers', () => {
    const params = [2];

    expect(validate('')).toBe(true);
    expect(validate('11.223123818')).toBe(true);
    expect(validate(['11.223123818', '13.1231'])).toBe(true);
    expect(validate('11.223123818', [])).toBe(true);
    expect(validate('11.223123818', undefined)).toBe(true);
    expect(validate('11.223123818', [undefined])).toBe(true);
    expect(validate('11.2', params)).toBe(true);
    expect(validate('11.23', params)).toBe(true);
    expect(validate('-1', params)).toBe(true);
    expect(validate('11', params)).toBe(true);
    expect(validate('.11')).toBe(true);
    expect(validate('1', ['0'])).toBe(true);

    expect(validate('11.234', params)).toBe(false);
    expect(validate('1-', params)).toBe(false);
    expect(validate('1-1', params)).toBe(false);
    expect(validate('1-1.22', params)).toBe(false);
    expect(validate(['1-2.223123818', '1-3.1231'])).toBe(false);
    expect(validate('a')).toBe(false);
    expect(validate('1.11', ['0'])).toBe(false);
});


test('decimal separator can be customized', () => {
    const params = [2, ','];
    expect(validate('11.23', params)).toBe(false);
    expect(validate('11,23', params)).toBe(true);
});