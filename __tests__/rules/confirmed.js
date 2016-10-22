import validate from './../../src/rules/confirmed';
import helpers from './../helpers';

it('validates a field confirmation', () => {
    helpers.jsdom({ name: 'somefield', value: 'p@$$word' }, () => {
        expect(validate('p@$$word', 'somefield')).toBe(true);
    });

    // field not found.
    helpers.jsdom(false, () => {
        expect(validate('p@$$word', 'somefield')).toBe(true);
    });

    // fields do not match.
    helpers.jsdom({ name: 'somefield', value: 'p@$$word' }, () => {
        expect(validate('password', 'somefield')).toBe(false);
    });
});
