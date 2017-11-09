import * as utils from '../src/core/utils';
import * as dateUtils from '../src/core/utils/date';
import * as i18Utils from '../locale/utils';

test('gets the data attribute prefixed with the plugin', () => {
  document.body.innerHTML =
      `<div>
          <input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">
      </div>`;

  const el = document.querySelector('#el');

  expect(utils.getDataAttribute(el, 'rules')).toBe('required');
  expect(utils.getDataAttribute(el, 'delay')).toBe('100');
  expect(utils.getDataAttribute(el, 'as')).toBe(null);
});

test('sets the data attribute prefixed with the plugin vendor code', () => {
  document.body.innerHTML =
      `<input id="el" type="text" name="field" data-vv-delay="100">`;

  const el = document.querySelector('#el');
  expect(utils.getDataAttribute(el, 'delay')).toBe('100');
  utils.setDataAttribute(el, 'delay', 200);
  expect(utils.getDataAttribute(el, 'delay')).toBe('200');
  utils.setDataAttribute(el, 'something', 'value');
  expect(utils.getDataAttribute(el, 'something')).toBe('value');
});

test('gets the element scope from the element or from the owning form', () => {
  document.body.innerHTML =
      `<div>
          <input id="el" type="text" name="field" data-vv-scope="scope1">
      </div>`;
  let el = document.querySelector('#el');
  expect(utils.getScope(el)).toBe('scope1');

  document.body.innerHTML =
      `<form data-vv-scope="form-scope">
          <input id="el" type="text" name="field">
      </form>`;
  el = document.querySelector('#el');
  expect(utils.getScope(el)).toBe('form-scope');
});

test('removes classes', () => {
  document.body.innerHTML = '<input id="el" type="text" class="some class">';
  let el = document.querySelector('#el');
  utils.removeClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(false);

  // repete for else check.
  utils.removeClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(false);

  // test polyfill.
  el = { className: 'some class' };

  utils.removeClass(el, 'class');
  expect(utils.hasClass(el, 'class')).toBe(false);
});

test('adds classes', () => {
  document.body.innerHTML = '<input id="el" type="text">';
  let el = document.querySelector('#el');
  utils.addClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(true);

  // reptition has no issues.
  utils.addClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(true);
  expect(el.className).toBe('some');

  // test polyfill.
  el = { className: 'some' };

  expect(utils.hasClass(el, 'class')).toBe(false);
  utils.addClass(el, 'class');
  expect(utils.hasClass(el, 'class')).toBe(true);
  expect(utils.hasClass(el, 'some class')).toBe(true);
});

test('toggles classes', () => {
  document.body.innerHTML = '<input id="el" type="text">';
  const el = document.querySelector('#el');
  utils.toggleClass(el, 'some', true);
  expect(utils.hasClass(el, 'some')).toBe(true);

  utils.toggleClass(el, 'some', false);
  expect(utils.hasClass(el, 'some')).toBe(false);

  expect(() => {
    utils.toggleClass(el, null, true);
  }).not.toThrow();
});

test('warns with branded message', () => {
  global.console = { warn: jest.fn() }
  utils.warn('Something is not right');
  expect(console.warn).toBeCalledWith('[vee-validate] Something is not right');
});

describe('normalizes rules', () => {
  test('it normalizes string validation rules', () => {
    const rules = utils.normalizeRules('required|email|min:3|dummy:1,2,3|||');
    expect(rules).toEqual({
      required: [],
      email: [],
      min: ['3'],
      dummy: ['1', '2', '3']
    });
  });

  test('returns empty object if falsy rules value', () => {
    expect(utils.normalizeRules('')).toEqual({});
    expect(utils.normalizeRules(false)).toEqual({});
    expect(utils.normalizeRules(null)).toEqual({});
    expect(utils.normalizeRules(undefined)).toEqual({});
    expect(utils.normalizeRules(1)).toEqual({});
  });

  test('it normalizes object validation rules', () => {
    const rules = utils.normalizeRules({
      required: true,
      email: true,
      min: 3,
      dummy: [1, 2, 3],
      numeric: false
    });
    expect(rules).toEqual({
      required: [],
      email: [],
      min: [3],
      dummy: [1, 2, 3]
    });
  });
});

test('gets appropiate input event name for inputs', () => {
  const text = { type: 'text' };
  const select = { tagName: 'SELECT' };
  const checkbox = { type: 'checkbox' };
  const radio = { type: 'radio' };
  const file = { type: 'file' };

  expect(utils.getInputEventName(text)).toBe('input');
  expect(utils.getInputEventName(select)).toBe('change');
  expect(utils.getInputEventName(checkbox)).toBe('change');
  expect(utils.getInputEventName(radio)).toBe('change');
  expect(utils.getInputEventName(file)).toBe('change');
});

test('creates branded errors', () => {
  expect(() => {
    throw utils.createError('My Error')
  }).toThrowError('[vee-validate] My Error');
});

test('formats file sizes', () => {
  expect(i18Utils.formatFileSize(1000)).toBe('1000 KB');
  expect(i18Utils.formatFileSize(1024)).toBe('1 MB');
  expect(i18Utils.formatFileSize(1050000)).toBe('1 GB');
});

test('checks if vee-validate is available globally.', () => {
  expect(i18Utils.isDefinedGlobally()).toBe(false);
  global.VeeValidate = {
    myprop: true
  };
  expect(i18Utils.isDefinedGlobally()).toBe(true);
});

test('creates a proxy if available', () => {
  const obj = {};
  const handler = {};

  // returns the same object if no proxy is detected.
  expect(utils.createProxy(obj, handler)  === obj).toBe(false);
});

describe('pareses date values', () => {
  const format = 'DD-MM-YYYY';

  test('parses string formatted dates without allowing overflows', () => {
    expect(dateUtils.parseDate('11-12-2016', format)).toBeTruthy();
    expect(dateUtils.parseDate('11-13-2016', format)).toBe(null);
  });

  test('date objects are checked if they are valid', () => {
    expect(dateUtils.parseDate(new Date(2017, 12, 11), format)).toBeTruthy();
    expect(dateUtils.parseDate(new Date(2017, 13, 11), format)).toBeTruthy();
    expect(dateUtils.parseDate(Date.parse('foo'), format)).toBe(null);
  });

});

describe('makeEventsArray', () => {
  test('it creates valid event arrays', () => {
    expect(utils.makeEventsArray('input|blur|change')).toEqual(['input', 'blur', 'change']);
    expect(utils.makeEventsArray('focus')).toEqual(['focus'])
  });

  test('it handles empty event strings', () => {
    expect(utils.makeEventsArray('')).toEqual([]);
  });

  test('it handles invalid event strings', () => {
    expect(utils.makeEventsArray('input, focus')).not.toEqual(['input', 'focus']);
    expect(utils.makeEventsArray('blur/change')).toEqual(['blur/change']);
  });
});

describe('makeDelayObject', () => {
  test('it handles delays from an object under the global key', () => {
    expect(utils.makeDelayObject(['input', 'blur'], {global: {input: 100, blur: 200}})).toEqual({input: 100, blur: 200});
    expect(utils.makeDelayObject(['change'], {global: {change: 100}})).toEqual({change: 100});
  });

  test('it handles delays from an object under the local key', () => {
    expect(utils.makeDelayObject(['input'], {local: {input: 100}})).toEqual({input: 100});
  });

  test('it handles overwrites values from the global key with those from local key', () => {
    expect(utils.makeDelayObject(['input'], {local: {input: 100}, global: {input: 500}})).toEqual({input: 100});
    expect(utils.makeDelayObject(['input', 'blur'], {local: {input: 600}, global: {input: 200, blur: 400}})).toEqual({input: 600, blur: 400});
  });

  test('it handles all events and sets them to 0', () => {
    expect(utils.makeDelayObject(['change', 'blur', 'focus'], {})).toEqual({change: 0, blur: 0, focus: 0});
  });

  test('it handles empty events', () => {
    expect(utils.makeDelayObject([], {global: {input: 100}})).toEqual({});
  });

  test('it handles empty given objects', () => {
    expect(utils.makeDelayObject(['input'], {})).toEqual({input: 0});
  });

  test('it handles empty events and empty given objects together', () => {
    expect(utils.makeDelayObject([], {})).toEqual({});
  });

  test('it handles already valid delay objects', () => {
    expect(utils.makeDelayObject(['input', 'blur'], {change: 200, focus: 800})).toEqual({change: 200, focus: 800});
  });

  test('it handles delay integers', () => {
    expect(utils.makeDelayObject(['focus', 'input'], 600)).toEqual({focus: 600, input: 600});
  });
});

describe('deepParseInt', () => {
  test('it parses all values on the first level of an object to int', () => {
    expect(utils.deepParseInt({ blur: "10", input: "400", focus: 300, change: "hello" })).toEqual({ blur: 10, input: 400, focus: 300, change: NaN });
  });
});
