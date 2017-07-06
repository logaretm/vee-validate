import ListenerGenerator from './../src/listeners';
import helpers from './helpers';

test('has field dependent rule', () => {
  document.body.innerHTML = '<input id="el" type="text" name="el">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, '', helpers.vnode(), {});
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

  expect(lg._hasFieldDependency({ required: true, confirmed: 'field' })).toBe('field');
  expect(lg._hasFieldDependency({ required: true })).toBe(false);
});

test('should not crash if no rules attribute was specified', () => {
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');

  expect(() => {
  const lg = new ListenerGenerator(el, helpers.binding(), helpers.vnode(), {});
  lg.attach();
  }).not.toThrowError("Cannot read property 'split' of null");
});

test('should get the arg', () => {
  expect.assertions(11);
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');

  // Arg is passed to the directive.
  let lg = new ListenerGenerator(el, { arg: 'email', expression: true, value: 'required|email' }, helpers.vnode(), {});
  expect(lg._resolveModel([]).expression).toBe('email');

  // Arg is passed as part of the expression.
  lg = new ListenerGenerator(el, { expression: true, value: { rules: 'required|email', arg: 'form.email' } }, helpers.vnode(), {});
  expect(lg._resolveModel([]).expression).toBe('form.email');

  // Arg is passed in v-model.
  const vnode = helpers.vnode();
  vnode.context = {
  u: {
    nAMe: null
  },
  A: true,
  may12: true
  };
  lg = new ListenerGenerator(el, {}, vnode, {});
  const directives = [
    { name: 'model', expression: 'u.nAMe', valid: true, modifiers: {} },
    { name: 'model', expression: 'A', valid: true, modifiers: {} },
    { name: 'model', expression: 'u.', valid: false, modifiers: {} },
    { name: 'model', expression: '.u', valid: false, modifiers: {} },
    { name: 'model', expression: '12may', valid: false, modifiers: {} },
    { name: 'model', expression: 'may12', valid: true, modifiers: {} },
    { name: 'model', expression: 'users[1]', valid: false, modifiers: {} },
    { name: 'model', expression: 'u.1', valid: false, modifiers: {} },
    { name: 'model', expression: 'u .NAME', valid: false, modifiers: {} }
  ];

  directives.forEach(dir => {
  expect(lg._resolveModel({ directives: [dir] }).watchable).toBe(dir.valid);
  });
});

test('should add unwatch property for arg watching', () => {
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, { arg: 'email', expression: true, value: 'required|email', modifiers: {} }, helpers.vnode(), {});
  lg.vm = { $watch(arg, callback) { return true; }, $validator: { attach() {} } };
  expect(lg.unwatch).toBeFalsy();
  lg.attach();
  expect(lg.unwatch).toBeTruthy();
});

test('detects input listener events', () => {
  document.body.innerHTML = '<input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">';
  const el = document.querySelector('#el');

  const valid = [
    ['file', '_fileListener', ['change']],
    ['radio', '_radioListener', ['change']],
    ['checkbox', '_checkboxListener', ['change']],
    ['text', '_inputListener', ['input', 'blur']]
  ];

  valid.forEach(([type, callback, event]) => {
  el.type = type;
  const lg = new ListenerGenerator(el, '', helpers.vnode(), {})._getSuitableListener();
  expect(lg.listener.name).toBe(callback);
  expect(lg.names).toEqual(event);
  });
});

test('detects custom listener events', () => {
  const valid = [
  'foo|bar',
  'baz'
  ];

  valid.forEach(event => {
  document.body.innerHTML = `<input id="el" type="text" name="field" data-vv-validate-on="${event}">`;
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, helpers.binding(), helpers.vnode(), {})._getSuitableListener();
  expect(lg.names).toEqual(event.split('|'));
  });
});

test('can resolve a field name', () => {
  // using direct field name.
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  let el = document.querySelector('#el');
  let name = new ListenerGenerator(el, {}, helpers.vnode(), {})._resolveFieldName();
  expect(name).toBe('field');

  // using data attribute.
  document.body.innerHTML = '<input id="el" type="text" data-vv-name="dataName">';
  el = document.querySelector('#el');
  name = new ListenerGenerator(el, {}, helpers.vnode(), {})._resolveFieldName();
  expect(name).toBe('dataName');

  // using arg does not affect the field name.
  name = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {})._resolveFieldName();
  expect(name).toBe('dataName');

  // using component attribute.
  let cgl = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {});
  cgl.component = { name: 'componentName' };
  // it will use the data-vv-name then the name property of the component if it exists.
  expect(cgl._resolveFieldName()).toBe('dataName');

  // No data-vv-name.
  document.body.innerHTML = '<input id="el" type="text">';
  el = document.querySelector('#el');
  cgl = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {});
  cgl.component = { name: 'componentName' };
  expect(cgl._resolveFieldName()).toBe('componentName');
});

test('can generate a scoped listener', () => {
  const func = jest.fn();
  document.body.innerHTML = '<input id="el" type="text" name="name" data-vv-scope="scope1">';
  const el = document.querySelector('#el');
  const scopedCallback = new ListenerGenerator(el, {}, helpers.vnode(), {})._getScopedListener(() => {
  func();
  });

  // no scope, yep.
  scopedCallback();
  expect(func.mock.calls.length).toBe(1);

  // same scope, yep.
  scopedCallback('scope1');
  expect(func.mock.calls.length).toBe(2);

  // different scope, nope.
  scopedCallback('scope2');
  expect(func.mock.calls.length).toBe(2);
});

test('resolves value getters for text inputs', () => {
  document.body.innerHTML = '<input id="el" type="text" name="name" value="val">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const { context, getter } = lg._resolveValueGetter();

  expect(context()).toBe(el);
  expect(getter(el)).toBe('val');
  el.value = 'notval';
  expect(getter(context())).toBe('notval');
});

test('resolves value getters for file inputs', () => {
  const el = {
  name: 'upload',
  type: 'file',
  getAttribute() {
    return '';
  },
  files: [
    helpers.file('val.jpg', 'image/jpg')
  ]
  };
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const { context, getter } = lg._resolveValueGetter();

  expect(context()).toBe(el);
  expect(getter(context())).toEqual(el.files);
  el.files.push(helpers.file('another.jpg', 'image/jpg'));
  expect(getter(context())).toEqual(el.files);
});

test('resolves value getters for components', () => {
  document.body.innerHTML = '<input id="el" type="text" name="name" value="first" data-vv-value-path="internalValue">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg.component = { $el: el, internalValue: 'first' };
  const { context, getter } = lg._resolveValueGetter();

  expect(context()).toBe(lg.component);
  expect(getter(context())).toBe('first');
  lg.component.internalValue = 'second'; // simulate change.
  expect(getter(context())).toBe('second');

  // test value property fallback
  document.body.innerHTML = '<input id="el" type="text" name="name" value="1">';
  const newEl = document.querySelector('#el');
  lg.el = newEl;
  lg.component = { $el: el, value: '1' };
  const pairs = lg._resolveValueGetter();
  expect(pairs.getter(pairs.context())).toBe('1');
  lg.component.value = '2'; // simulate change.
  expect(pairs.getter(pairs.context())).toBe('2');
});

test('resolves value getters for checkboxes', () => {
  document.body.innerHTML = `
    <div>
      <input id="el1" type="checkbox" name="name" value="1" checked>
      <input id="el2" type="checkbox" name="name" value="2">
    </div>`;
  const el = document.querySelector('#el1');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
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
  expect(getter(context())).toBe(null);
});

test('resolves value getters for radio inputs', () => {
  document.body.innerHTML = `
    <div>
      <input id="el1" type="radio" name="name" value="1" checked>
      <input id="el2" type="radio" name="name" value="2">
    </div>`;
  const el = document.querySelector('#el1');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
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

test('can handle text input event', () => {
  document.body.innerHTML = '<input id="el" type="text" name="field" value="1">';
  const el = document.querySelector('#el');
  expect(() => {
  new ListenerGenerator(el, {}, helpers.vnode(), {})._inputListener();
  }).toThrow();
});

test('can handle file change event', done => {
  expect.assertions(1);
  document.body.innerHTML = '<input id="el" type="file" name="field" value="files.jpg">';
  const el = document.querySelector('#el');
  new ListenerGenerator(el, { modifiers: { reject: true } }, helpers.vnode(false), {})._fileListener().then(() => {
  expect(el.value).toBe(''); // test reject.
  done();
  });
});

test('can handle radio input change', () => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
    <input id="el" type="radio" name="field" value="1" checked>
    <input id="el2" type="radio" name="field" value="2">
  `;
  const el = document.querySelector('#el');
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._radioListener();
  }).toThrowError('1');
  document.body.innerHTML = `
    <input id="el" type="radio" name="field" value="1">
    <input id="el2" type="radio" name="field" value="2" checked>
  `;
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._radioListener();
  }).toThrowError('2');
});

test('can handle checkboxes input change', () => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
    <input id="el" type="checkbox" name="field" value="1" checked>
    <input id="el2" type="checkbox" name="field" value="2">
  `;
  const el = document.querySelector('#el');
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  }).toThrowError('1');
  document.body.innerHTML = `
    <input id="el" type="checkbox" name="field" value="1">
    <input id="el2" type="checkbox" name="field" value="2" checked>
  `;
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  }).toThrowError('2');
  document.body.innerHTML = `
    <input id="el" type="checkbox" name="field" value="1" checked>
    <input id="el2" type="checkbox" name="field" value="2" checked>
  `;
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  }).toThrowError('1');
  document.body.innerHTML = '';
  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  }).toThrowError('null');

  document.body.innerHTML = `
    <input id="el" type="checkbox" name="field" value="1">
    <input id="el2" type="checkbox" name="field" value="2">
  `;

  expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  }).toThrowError('null');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(false), {});
  document.body.innerHTML = '';
  expect(lg._checkboxListener()).toBeFalsy();
});

test('can handle select fields value change', () => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
    <select id="el" name="field">
      <option value="val1" checked>1</option>
      <option value="val2">2</option>
    </select>
  `;

  const el = document.querySelector('#el');
  expect(new ListenerGenerator(el, {}, vnode, {})._getSuitableListener().names).toEqual(['change', 'blur']);

  const error = expect(() => {
  new ListenerGenerator(el, {}, vnode, {})._inputListener();
  }).toThrowError('val1');
});

test('can handle component input event', () => {
  document.body.innerHTML = '<input id="el" type="text" name="name" value="1">';
  const el = document.querySelector('#el');
  const mockedComponent = {
  $on() {
    // eslint-disable-next-line
    throw 'something';
  },
  $watch() {}
  };

  let vnode = helpers.vnode(false);
  let lg = new ListenerGenerator(el, helpers.binding(), vnode, {});
  const error = expect(() => {
  lg.component = mockedComponent;
  lg.attach();
  }).toThrowError('something');

  vnode = helpers.vnode();
  lg = new ListenerGenerator(el, helpers.binding(), vnode, {});
  lg.component = {
  $on(whatever, callback) {
    lg.component.onInput = (value) => { callback(value); };
  },
  $watch() {}
  };
  expect(lg._attachComponentListeners()).toBeFalsy();
  expect(lg.component.onInput).toBeTruthy();
});

test('should attach additional listeners for rules with dependent fields', () => {
  document.body.innerHTML = `<div id="app">
    <input type="text" name="field" id="el" data-vv-rules="confirmed:other">
    <input type="text" name="other" id="other" data-vv-rules="confirmed:other">
  </div>`;
  const el = document.querySelector('#el');
  const vnode = helpers.vnode();

  const lg = new ListenerGenerator(el, {}, vnode, {});
  lg._attachValidatorEvent();
  expect(~lg.callbacks.map(c => c.el.name).indexOf('other')).toBeTruthy();
});

test('should not attach listeners for rules with dependent fields that do not exist', () => {
  document.body.innerHTML = `<div id="app">
    <input type="text" name="field" id="el" data-vv-rules="confirmed:other">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachValidatorEvent();

  expect(~lg.callbacks.map(c => c.el.name).indexOf('other')).toBeFalsy();
});

test('should attach a listener for each radio element', () => {
  document.body.innerHTML = `<div id="app">
    <input type="radio" name="field" id="el" value="1">
    <input type="radio" name="field" value="2">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachFieldListeners();
  expect(lg.callbacks.filter(c => c.el.name === 'field').length).toBe(2);
});


test('should attach a listener for each checkbox element', () => {
  document.body.innerHTML = `<div id="app">
    <input type="checkbox" name="field" id="el" value="1">
    <input type="checkbox" name="field" value="2">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachFieldListeners();
  expect(lg.callbacks.filter(c => c.el.name === 'field').length).toBe(2);
});

test('detaches listeners', () => {
  document.body.innerHTML = '<input type="text" name="field" id="el">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const throws = { unwatch: true, off: true };
  // eslint-disable-next-line
  lg.unwatch = t => { if (throws.unwatch) throw 'unwatched'; };

  // eslint-disable-next-line
  lg.component = { $off() { if (throws.off) throw 'offed listener'; } };
  lg.componentPropUnwatch = () => {};

  let calls = 0;
  el.removeEventListener = () => {
  calls++;
  };

  let error = expect(() => { lg.detach(); }).toThrowError('offed listener');
  throws.off = false;
  error = expect(() => { lg.detach(); }).toThrowError('unwatched');
  throws.unwatch = false;

  lg.callbacks.push({ el, name: 'input', listener: () => {} });
  expect(lg.callbacks.length).toBe(1);
  lg.detach();
  expect(calls).toBe(1);
});
