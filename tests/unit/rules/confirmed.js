import validate from './../../../src/rules/confirmed';
import helpers from './../../helpers';

test('validates a field confirmation', () => {
    expect(validate('p@$$word', 'p@$$word')).toBe(true);

    // fields do not match.
    expect(validate('password', 'p@$$word')).toBe(false);
});
