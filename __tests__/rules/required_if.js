import validate from './../../src/rules/required_if';
import helpers from './../helpers';

it('validates required if target field has right value', () => {
    helpers.querySelector({ name: 'somefield', value: 'value' });

    // Has value and target field has the right value.
    expect(validate('success', ['somefield', 'value'])).toBe(true);

    // No value -> required.
    expect(validate('', ['somefield', 'value'])).toBe(false);
});

it('validates required if target field does not exist', () => {
    // targetfield not found, validation fails.
    helpers.querySelector(false);
    expect(validate('success', ['somefield', 'value'])).toBe(false);
});

it('does not validate required if target field has wrong value', () => {
    // target field has other value, no validation applies.
    helpers.querySelector({ name: 'somefield', value: 'othervalue' });
    expect(validate('no-validation', ['somefield', 'value'])).toBe(true);
});
