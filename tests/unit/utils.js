import * as utils from '../../src/core/utils';
import * as dateUtils from '../../src/core/utils/date';
import * as i18Utils from '../../locale/utils';

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

test('checks if a value is an object', () => {
  expect(utils.isObject(null)).toBe(false);
  expect(utils.isObject([])).toBe(false);
  expect(utils.isObject('someval')).toBe(false);
  expect(utils.isObject({})).toBe(true);
});

test('returns first matching element from array', () => {
  const find = utils.find;
  // testing on a nodelist to check if it converts correctly.
  document.body.innerHTML = `
      <input class="class" name="i1" id="i1">
      <input class="class" name="i2">
      <input class="class" name="i3">
  `;
  const nodeList = document.querySelectorAll('.class');
  const el = document.querySelector('#i1');
  expect(find(nodeList, el => el.name === 'i1')).toBe(el);

  // test polyfill.
  let arr = Array.from(nodeList);
  arr.find = undefined;
  expect(find(arr, el => el.name === 'i1')).toBe(el);

  // test not found
  arr = [1, 2, 3];
  arr.find = undefined;
  expect(find(arr, i => i === 4)).toBe(undefined);
});

test('assigns objects', () => {
  const o1 = { a: 1, b: 1, c: 1 };
  const o2 = { b: 2, c: 2, d: { a: 1, b: 2 } };
  const o3 = { c: 3 };
  const result = { a: 1, b: 2, c: 3, d: { a: 1, b: 2 } };
  expect(utils.assign({}, o1, o2, o3, null)).toEqual(result);
  expect(() => {
    utils.assign(null, o1);
  }).toThrow();

  // TODO: test polyfill.
  expect(utils.assign({}, o1, o2, o3, null)).toEqual(result);
  expect(() => {
    utils.assign(null, o1);
  }).toThrow();
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

test('converts array like objects to arrays', () => {
  document.body.innerHTML = `
        <div class="class"></div>
        <div class="class"></div>
        <div class="class"></div>
    `;

  const nodeList = document.querySelectorAll('.class');
  expect(Array.isArray(nodeList)).toBe(false);

  let array = utils.toArray(nodeList);
  expect(Array.isArray(array)).toBe(true);

  // test polyfill.
  global.Array.from = undefined;
  array = utils.toArray(nodeList);
  expect(Array.isArray(array)).toBe(true);
  expect(array.length).toBe(3);
});


test('checks if a value path with exists', () => {
  const some = {
    value: {
      path: undefined,
      val: 1
    }
  };

  expect(utils.hasPath('value.val', some)).toBe(true); // exists.
  expect(utils.hasPath('value.path', some)).toBe(true); // undefined but exists.
  expect(utils.hasPath('value.not', some)).toBe(false); // does not.
});

test('gets the value path with a fallback value', () => {
  const some = {
    value: {
      path: undefined,
      val: 1
    }
  };

  expect(utils.getPath(null, some)).toBe(undefined); // no path.
  expect(utils.getPath('value.val', null)).toBe(undefined); // no object.

  expect(utils.getPath('value.val', some)).toBe(1); // exists.
  expect(utils.getPath('value.path', some)).toBe(undefined); // undefined but exists.
  expect(utils.getPath('value.not', some, false)).toBe(false); // does not.
});


test('debounces the provided function', done => {
  const [value, argument] = ['someval', 'somearg'];
  expect.assertions(2);
  const func = utils.debounce((val, arg) => {
    expect(val).toBe(value);
    expect(arg).toBe(argument);
  }, 2);

  func(value, argument);
  setTimeout(() => {
    done();
  }, 3);
});

test('calls functions immediatly if time is 0', done => {
  const [value, argument] = ['someval', 'somearg'];
  expect.assertions(2);
  const func = utils.debounce((val, arg) => {
    expect(val).toBe(value);
    expect(arg).toBe(argument);
  }, 0);
  // test default value.
  const func2 = utils.debounce((val, arg) => {
    expect(val).toBe(value);
    expect(arg).toBe(argument);
  });

  func(value, argument);
  expect.assertions(4);
  func2(value, argument);
  done();
});

test('warns with branded message', () => {
  global.console = { warn: jest.fn() }
  utils.warn('Something is not right');
  expect(console.warn).toBeCalledWith('[vee-validate] Something is not right');
});

test('it generates a unique id', () => {
  // using ES6 Sets to test, FeelsGood.
  const ids = new Set();
  // test uniqueness on million elements, more than that is unlikely to happen within the same validator.
  for (let i = 0; i < 1000000; i++) {
    ids.add(utils.uniqId());
  }

  // 1000 unique entries.
  expect(ids.size).toBe(1000000);
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

test('checks if a value is a callable function', () => {
  expect(utils.isCallable(null)).toBe(false);
  expect(utils.isCallable(() => {})).toBe(true);
});

test('compares two values', () => {
  expect(utils.isEqual(true, true)).toBe(true);
  expect(utils.isEqual(true, false)).toBe(false);

  expect(utils.isEqual(1, 1)).toBe(true);
  expect(utils.isEqual(1, 2)).toBe(false);

  expect(utils.isEqual('1', 1)).toBe(false);

  expect(utils.isEqual('value', 'value')).toBe(true);
  expect(utils.isEqual('value1', 'value')).toBe(false);

  expect(utils.isEqual({}, {})).toBe(true);
  expect(utils.isEqual({}, { new: null })).toBe(false);
  // same effect.
  expect(utils.isEqual({}, { new: undefined })).toBe(true);

  //
  expect(utils.isEqual({
    foo: 1,
    bar: 2,
    baz: 'other'
  }, {
    foo: 1,
    bar: '2',
    baz: 'other'
  })).toBe(false);

  expect(utils.isEqual({
    foo: /myregex/gi,
    bar: 2
  }, {
    foo: /myregex/ig,
    bar: 2
  })).toBe(true);


  expect(utils.isEqual({
    foo: /myregx/g,
    bar: 2
  }, {
    foo: /myregex/ig,
    bar: 2
  })).toBe(false);

  expect(utils.isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(utils.isEqual([1, 2, 3], [1, 2])).toBe(false);
  expect(utils.isEqual([1, 2, 3], [1, 2, '3'])).toBe(false);
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
  test('delays fallback to the global delays if not found', () => {
    expect(utils.makeDelayObject(['input', 'blur'], {}, { input: 100, blur: 200 })).toEqual({input: 100, blur: 200});
    expect(utils.makeDelayObject(['change'], {}, { change: 100 })).toEqual({change: 100});
  });

  test('it handles delays from an object under the local key', () => {
    expect(utils.makeDelayObject(['input'], { input: 100 }, {})).toEqual({ input: 100 });
  });

  test('it handles overwrites values from the global key with those from local key', () => {
    expect(utils.makeDelayObject(['input'], {input: 100}, { input: 500 })).toEqual({input: 100});
    expect(utils.makeDelayObject(['input', 'blur'], {input: 600}, {input: 200, blur: 400})).toEqual({input: 600, blur: 400});
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

  test('only outputs the requested events', () => {
    expect(utils.makeDelayObject(['input', 'blur'], {change: 200, focus: 800})).toEqual({ blur: 0, input: 0});
  });

  test('it handles delay integers', () => {
    expect(utils.makeDelayObject(['focus', 'input'], 600)).toEqual({focus: 600, input: 600});
  });

  test('patches unspecified events with the fallback delay config', () => {
    expect(utils.makeDelayObject(['input', 'blur'], { input: 300 }, 500)).toEqual({
      input: 300,
      blur: 500
    });
  });
});

describe('deepParseInt', () => {
  test('it parses numbers', () => {
    expect(utils.deepParseInt(10)).toEqual(10);
  });

  test('it parses numeric strings', () => {
    expect(utils.deepParseInt("10")).toEqual(10);
    expect(utils.deepParseInt("hey")).toEqual(NaN);
  });

  test('it parses all values on the first level of an object to int', () => {
    expect(utils.deepParseInt({ blur: "10", input: "400", focus: 300, change: "hello" })).toEqual({ blur: 10, input: 400, focus: 300, change: NaN });
  });
});
