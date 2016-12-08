import ListenerGenerator from './../src/listeners';
import helpers from './helpers';
import Validator from '../src/validator';

it('has field dependent rule', () => {
    const lg = new ListenerGenerator({ name: 'el'}, '', '', {});
    expect(lg._hasFieldDependency('confirmed:field|required')).toBe('field');
    expect(lg._hasFieldDependency('required|before:field')).toBe('field');
    expect(lg._hasFieldDependency('after:field')).toBe('field');
    // assume a sensible default.
    expect(lg._hasFieldDependency('required|confirmed')).toBe('el_confirmation');

    // If no field was mentioned, we don't have to search for one
    expect(lg._hasFieldDependency('required|after')).toBe(false);
    expect(lg._hasFieldDependency('required|before')).toBe(false);

    // custom user declared rules
    expect(lg._hasFieldDependency('required|before_time:10')).toBe(false);
    expect(lg._hasFieldDependency('required|only_after:10')).toBe(false);
});

it('detects input listener events', () => {
    document.body.innerHTML =`<input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">`;
    const el = document.querySelector('#el');

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
    const valid = [
        'foo|bar',
        'baz'
    ];

    valid.forEach(event => {
        document.body.innerHTML =`<input id="el" type="text" name="field" data-vv-validate-on="${event}">`;
        const el = document.querySelector('#el');
        const lg = new ListenerGenerator(el, '', '', {})._getSuitableListener();
        expect(lg.names).toEqual(event.split('|'));
    });
});

it('can resolve a field name', () => {
    // using direct field name.
    document.body.innerHTML = `<input id="el" type="text" name="field">`;
    let el = document.querySelector('#el');
    let name = new ListenerGenerator(el, {}, {}, {})._resolveFieldName();
    expect(name).toBe('field');

    // using data attribute.
    document.body.innerHTML = `<input id="el" type="text" data-vv-name="dataName">`;
    el = document.querySelector('#el');
    name = new ListenerGenerator(el, {}, {}, {})._resolveFieldName();
    expect(name).toBe('dataName');

    // using expression does not affect the field name.
    name = new ListenerGenerator(el, { expression: 'expressedName' }, '', {})._resolveFieldName();
    expect(name).toBe('dataName');

    // using component attribute.
    let cgl = new ListenerGenerator(el, { expression: 'expressedName' }, '', {});
    cgl.component = { name: 'componentName' };
    // it will use the data-vv-name then the name property of the component if it exists.
    expect(cgl._resolveFieldName()).toBe('dataName');

    // No data-vv-name.
    document.body.innerHTML = `<input id="el" type="text">`;
    el = document.querySelector('#el');
    cgl = new ListenerGenerator(el, { expression: 'expressedName' }, '', {});
    cgl.component = { name: 'componentName' };
    expect(cgl._resolveFieldName()).toBe('componentName');
});

it('can generate a scoped listener', () => {
    document.body.innerHTML = `<input id="el" type="text" name="name" data-vv-scope="scope1">`;
    const el = document.querySelector('#el');
    const scopedCallback = new ListenerGenerator(el, {}, {}, {})._getScopedListener(() => {
        throw 'Oops!'
    });

    // different scope, nope.
    expect(() => {
        scopedCallback('scope2')
    }).not.toThrow('Oops!');

    // no scope, yep.
    expect(() => {
        scopedCallback()
    }).toThrowError('Oops!');

    // same scope, yep.
    expect(() => {
        scopedCallback('scope1')
    }).toThrowError('Oops!');
});

describe('can resolve value getters and context functions', () => {
    it('resolves value getters for text inputs', () => {
        document.body.innerHTML = `<input id="el" type="text" name="name" value="val">`;
        const el = document.querySelector('#el');
        const lg = new ListenerGenerator(el, {}, {}, {});
        const { context, getter } = lg._resolveValueGetter();

        expect(context()).toBe(el);
        expect(getter(el)).toBe('val');
        el.value = 'notval';
        expect(getter(context())).toBe('notval');
    });

    it('resolves value getters for file inputs', () => {
        const el = {
            name: 'upload',
            type: 'file',
            files: [
                helpers.file('val.jpg', 'image/jpg')
            ]
        };
        const lg = new ListenerGenerator(el, {}, {}, {});
        const { context, getter } = lg._resolveValueGetter();

        expect(context()).toBe(el);
        expect(getter(context())).toEqual(el.files);
        el.files.push(helpers.file('another.jpg', 'image/jpg'));
        expect(getter(context())).toEqual(el.files);
    });

    it('resolves value getters for components', () => {
        document.body.innerHTML = `<input id="el" type="text" name="name" value="1" data-vv-value-path="internalValue">`;
        const el = document.querySelector('#el');
        const lg = new ListenerGenerator(el, {}, {}, {});
        lg.component = { $el: el, internalValue: 'first' };
        const { context, getter } = lg._resolveValueGetter();

        expect(context()).toBe(lg.component);
        expect(getter(context())).toBe('first');
        lg.component.internalValue = 'second'; // simulate change.
        expect(getter(context())).toBe('second');
    });

    it('resolves value getters for checkboxes', () => {
        document.body.innerHTML = `
            <div>
                <input id="el1" type="checkbox" name="name" value="1" checked>
                <input id="el2" type="checkbox" name="name" value="2">
            </div>`;
        const el = document.querySelector('#el1');
        const lg = new ListenerGenerator(el, {}, {}, {});
        const { context, getter } = lg._resolveValueGetter();
        expect(getter(context())).toEqual(['1']);
        document.body.innerHTML = `
            <div>
                <input id="el1" type="checkbox" name="name" value="1" checked>
                <input id="el2" type="checkbox" name="name" value="2" checked>
            </div>`;
        expect(getter(context())).toEqual(['1', '2']);
        document.body.innerHTML = `
            <div>
                <input id="el1" type="checkbox" name="name" value="1">
                <input id="el2" type="checkbox" name="name" value="2">
            </div>`;
        expect(getter(context())).toEqual(null);
    });

    it('resolves value getters for radio inputs', () => {
        document.body.innerHTML = `
            <div>
                <input id="el1" type="radio" name="name" value="1" checked>
                <input id="el2" type="radio" name="name" value="2">
            </div>`;
        const el = document.querySelector('#el1');
        const lg = new ListenerGenerator(el, {}, {}, {});
        const { context, getter } = lg._resolveValueGetter();
        expect(getter(context())).toBe('1');

        document.body.innerHTML = `
            <div>
                <input id="el1" type="radio" name="name" value="1">
                <input id="el2" type="radio" name="name" value="2" checked>
            </div>`;
        expect(getter(context())).toBe('2');
        document.body.innerHTML = `
            <div>
                <input id="el1" type="radio" name="name" value="1">
                <input id="el2" type="radio" name="name" value="2">
            </div>`;
        expect(getter(context())).toBe(null);
    });
});

describe('the generator can handle input events', () => {
    it('can handle text input event', () => {
        const vm = { $validator: helpers.validator() };
        document.body.innerHTML = `<input id="el" type="text" name="field" value="1">`;
        const el = document.querySelector('#el');
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._inputListener();
        }).toThrow();
    });

    it('can handle file change event', () => {
        let vm = { $validator: helpers.validator(false) };
        document.body.innerHTML = `<input id="el" type="file" name="field" value="files.jpg">`;
        const el = document.querySelector('#el');
        new ListenerGenerator(el, { modifiers: { reject: true }}, { context: vm }, {})._fileListener();
        expect(el.value).toBe(''); // test reject.
        vm = { $validator: helpers.validator() };
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._fileListener();
        }).toThrow();
    });

    it('can handle radio input change', () => {
        let vm = { $validator: helpers.validator() };
        document.body.innerHTML = `
            <input id="el" type="radio" name="field" value="1" checked>
            <input id="el2" type="radio" name="field" value="2">
        `;
        const el = document.querySelector('#el');
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._radioListener();
        }).toThrowError('1');
        document.body.innerHTML = `
            <input id="el" type="radio" name="field" value="1">
            <input id="el2" type="radio" name="field" value="2" checked>
        `;
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._radioListener();
        }).toThrowError('2');
    });

    it('can handle checkboxes input change', () => {
        let vm = { $validator: helpers.validator() };
        document.body.innerHTML = `
            <input id="el" type="checkbox" name="field" value="1" checked>
            <input id="el2" type="checkbox" name="field" value="2">
        `;
        const el = document.querySelector('#el');
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._checkboxListener();
        }).toThrowError('1');
        document.body.innerHTML = `
            <input id="el" type="checkbox" name="field" value="1">
            <input id="el2" type="checkbox" name="field" value="2" checked>
        `;
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._checkboxListener();
        }).toThrowError('2');

        document.body.innerHTML = `
            <input id="el" type="checkbox" name="field" value="1" checked>
            <input id="el2" type="checkbox" name="field" value="2" checked>
        `;
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._checkboxListener();
        }).toThrowError('1');
        document.body.innerHTML = ``;
        expect(() => {
            new ListenerGenerator(el, {}, { context: vm }, {})._checkboxListener();
        }).toThrowError("null");
    });
});
