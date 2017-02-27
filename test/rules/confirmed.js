import test from 'ava';
import validate from './../../src/rules/confirmed';
import helpers from './../helpers';

test('validates a field confirmation', t => {
    helpers.querySelector({ name: 'somefield', value: 'p@$$word' });
    t.true(validate('p@$$word', 'somefield'));

    // field not found.
    helpers.querySelector(false);
    t.false(validate('p@$$word', 'somefield'));

    // fields do not match.
    helpers.querySelector({ name: 'somefield', value: 'p@$$word' });
    t.false(validate('password', 'somefield'));
});
