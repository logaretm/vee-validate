import validate from './../../src/rules/required';

const valid = [
    'asjdj',
    0,
    'undefined',
    'null',
    's '
];

const invalid = [
    '',
    ' ',
    [],
    undefined,
    null
];

it('validates required', () => {
    valid.forEach(value => expect(validate(value)).toBe(true));

    invalid.forEach(value => expect(validate(value)).toBe(false));
});
