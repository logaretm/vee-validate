import ValidatorException from './../src/exceptions/validatorException';

it('can be converted to a string', () => {
    const ex = new ValidatorException('Something went wrong.');

    expect(String(ex)).toBe('Something went wrong.');
});
