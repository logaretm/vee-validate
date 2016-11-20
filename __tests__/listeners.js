import ListenerGenerator from './../src/listeners';
import helpers from './helpers';


it('has field dependent rule', () => {
    const lg = new ListenerGenerator({ name: 'el'}, '', '', {});
    expect(lg._hasFieldDependency('confirmed:field|required')).toBe('field');
    expect(lg._hasFieldDependency('required|before:field')).toBe('field');
    expect(lg._hasFieldDependency('after:field')).toBe('field');

    // If no field was mentioned, we don't have to search for one
    expect(lg._hasFieldDependency('required|after')).toBe(false);
    expect(lg._hasFieldDependency('required|confirmed')).toBe(false);
    expect(lg._hasFieldDependency('required|before')).toBe(false);

    // custom user declared rules
    expect(lg._hasFieldDependency('required|before_time:10')).toBe(false);
    expect(lg._hasFieldDependency('required|only_after:10')).toBe(false);
});

it('detects input listener events', () => {

    const el = document.createElement("input");
    el.name = 'field';
    el.dataset = {};

    const valid = [
        ['file', '_fileListener', ['change']],
        ['radio', '_radioListener', ['change']],
        ['checkbox', '_checkboxListener', ['change']],
        ['text', '_inputListener', ['input', 'blur']]
    ];

    valid.forEach(([type, callback, event]) => {
        el.type = type;
        const lg = new ListenerGenerator(el, '', '', {})._getSuitableListener();
        expect(lg.listener.name).toBe(callback);
        expect(lg.names).toEqual(event);
    });
});


it('detects custom listener events', () => {

    const el = document.createElement("input");
    el.name = 'field';
    el.dataset = {};

    const valid = [
        'foo|bar',
        'baz'
    ];

    valid.forEach(event => {
        el.dataset.vvValidateOn = event;
        const lg = new ListenerGenerator(el, '', '', {})._getSuitableListener();
        expect(lg.names).toEqual(event.split('|'));
    });
});
