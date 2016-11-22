import * as helpers from '../src/utils/helpers.js';

it('gets the data attribute prefixed with the plugin', () => {
    document.body.innerHTML =
        `<div>
            <input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">
        </div>`;

    const el = document.querySelector('#el');

    expect(helpers.getDataAttribute(el, 'rules')).toBe('required');
    expect(helpers.getDataAttribute(el, 'delay')).toBe('100');
    expect(helpers.getDataAttribute(el, 'as')).toBe(null);
});
