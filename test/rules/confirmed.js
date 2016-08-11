import test from 'ava';
import validate from './../../src/rules/confirmed';
import mocks from './../helpers';

test('it validates a field confirmation', t => {
    mocks.querySelector({ value: 'p@$$word' });
    t.true(validate('p@$$word', 'somefield'));

    // field not found.
    mocks.querySelector(null);
    t.false(validate('p@$$word', 'somefield'));

    // fields do not match.
    mocks.querySelector({ value: 'p@$$word' });
    t.false(validate('password', 'somefield'));
});
