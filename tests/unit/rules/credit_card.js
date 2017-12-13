import validate from './../../../src/rules/credit_card';

const valid = [
    '4111111111111111',
    '4716461583322103',
    '4716-2210-5188-5662',
    '4929 7226 5379 7141',
    '6234698580215388'
];

const invalid = [
    'foo',
    '5398228707871528',
    '2718760626256571',
    undefined,
    null
];

test('validates that the number is a valid credit card', () => {
    expect.assertions(10);
    valid.forEach(value => expect(validate(value)).toBe(true));
    invalid.forEach(value => expect(validate(value)).toBe(false));
});
