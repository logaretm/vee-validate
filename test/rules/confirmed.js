import validate from './../../src/rules/confirmed';
import helpers from './../helpers';

it('validates a field confirmation', () => {
    helpers.querySelector({ name: 'somefield', value: 'p@$$word' });
    expect(validate('p@$$word', 'somefield')).toBe(true);

    // field not found.
    helpers.querySelector(false);
    expect(validate('p@$$word', 'somefield')).toBe(false);

    // fields do not match.
    helpers.querySelector({ name: 'somefield', value: 'p@$$word' });
    expect(validate('password', 'somefield')).toBe(false);
});
