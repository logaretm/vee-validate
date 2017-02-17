import * as helpers from '../src/utils';

it('gets the data attribute prefixed with the plugin', () => {
    document.body.innerHTML =
        `<div>
            <input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">
        </div>`;

    const el = document.querySelector('#el');

    expect(helpers.getDataAttribute(el, 'rules')).toBe('required');
    expect(helpers.getDataAttribute(el, 'delay')).toBe('100');
    expect(helpers.getDataAttribute(el, 'as')).toBeNull();
});

it('gets the element scope from the element or from the owning form', () => {
    document.body.innerHTML =
        `<div>
            <input id="el" type="text" name="field" data-vv-scope="scope1">
        </div>`;
    let el = document.querySelector('#el');
    expect(helpers.getScope(el)).toBe('scope1');

    document.body.innerHTML =
        `<form data-vv-scope="form-scope">
            <input id="el" type="text" name="field">
        </form>`;
    el = document.querySelector('#el');
    expect(helpers.getScope(el)).toBe('form-scope');
});

it('checks if a value is an object', () => {
    const isObject = helpers.isObject;

    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject('someval')).toBe(false);
    expect(isObject({})).toBe(true);
});

it('returns first matching element from array', () => {
    const find = helpers.find;
    const arr = [
        { el: 'name' },
        { el: 'email' },
        { el: 'address' },
        { el: 'something' },
        { el: 'else' }
    ];
    expect(find(arr, e => e.el === 'name').el).toBe('name');
    arr.find = null;
    
    expect(find(arr, e => e.el === 'else').el).toBe('else');
});

it('should return valid rules data', () => {
    const getRules = helpers.getRules;
    document.body.innerHTML = `<input type="text" name"el" id="el" data-vv-rules="required|email">`;
    const el = document.querySelector('#el');
    expect(getRules(null, null, el)).toBe('required|email');

    let exp = 'someexpr';
    let value = 'required|email';

    expect(getRules(exp, value)).toBe('required|email');
    
    value = {
        rules: {
            required: true,
            email: true
        }
    };

    expect(getRules(exp, value)).toEqual({
        required: true,
        email: true
    });

    value = {
        required: true,
        email: true
    };

    expect(getRules(exp, value)).toEqual({
        required: true,
        email: true
    });
});