import test from 'ava';
import ListenerGenerator from './../src/listeners';
import helpers from './helpers';

test('has field dependent rule', t => {
  document.body.innerHTML = '<input id="el" type="text" name="el">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, '', helpers.vnode(), {});
  t.is(lg._hasFieldDependency('confirmed:field|required'), 'field');
  t.is(lg._hasFieldDependency('required|before:field'), 'field');
  t.is(lg._hasFieldDependency('after:field'), 'field');
  // assume a sensible default.
  t.is(lg._hasFieldDependency('required|confirmed'), 'el_confirmation');

  // If no field was mentioned, we don't have to search for one
  t.false(lg._hasFieldDependency('required|after'));
  t.false(lg._hasFieldDependency('required|before'));

  // custom user declared rules
  t.false(lg._hasFieldDependency('required|before_time:10'));
  t.false(lg._hasFieldDependency('required|only_after:10'));

  t.is(lg._hasFieldDependency({ required: true, confirmed: 'field' }), 'field');
  t.false(lg._hasFieldDependency({ required: true }));
});

test('should not crash if no rules attribute was specified', t => {
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');

  t.notThrows(() => {
    const lg = new ListenerGenerator(el, helpers.binding(), helpers.vnode(), {});
    lg.attach();
  }, "Cannot read property 'split' of null");
});

test('should get the arg', t => {
  t.plan(11);
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');

  // Arg is passed to the directive.
  let lg = new ListenerGenerator(el, { arg: 'email', expression: true, value: 'required|email' }, helpers.vnode(), {});
  t.is(lg._getArg(), 'email');

  // Arg is passed as part of the expression.
  lg = new ListenerGenerator(el, { expression: true, value: { rules: 'required|email', arg: 'form.email' } }, helpers.vnode(), {});
  t.is(lg._getArg(), 'form.email');

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
      { name: 'model', expression: 'u.nAMe', valid: true },
      { name: 'model', expression: 'A', valid: true },
      { name: 'model', expression: 'u.', valid: false },
      { name: 'model', expression: '.u', valid: false },
      { name: 'model', expression: '12may', valid: false },
      { name: 'model', expression: 'may12', valid: true },
      { name: 'model', expression: 'users[1]', valid: false },
      { name: 'model', expression: 'u.1', valid: false },
      { name: 'model', expression: 'u .NAME', valid: false }
  ];

  directives.forEach(dir => {
    t.is(lg._resolveModel([dir]) !== undefined, dir.valid);
  });
});

test('should add unwatch property for arg watching', t => {
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, { arg: 'email', expression: true, value: 'required|email', modifiers: {} }, helpers.vnode(), {});
  lg.vm = { $watch(arg, callback) { return true; }, $validator: { attach() {} } };
  t.falsy(lg.unwatch);
  lg.attach();
  t.truthy(lg.unwatch);
});

test('detects input listener events', t => {
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
    t.is(lg.listener.name, callback);
    t.deepEqual(lg.names, event);
  });
});

test('detects custom listener events', t => {
  const valid = [
    'foo|bar',
    'baz'
  ];

  valid.forEach(event => {
    document.body.innerHTML = `<input id="el" type="text" name="field" data-vv-validate-on="${event}">`;
    const el = document.querySelector('#el');
    const lg = new ListenerGenerator(el, helpers.binding(), helpers.vnode(), {})._getSuitableListener();
    t.deepEqual(lg.names, event.split('|'));
  });
});

test('can resolve a field name', t => {
  // using direct field name.
  document.body.innerHTML = '<input id="el" type="text" name="field">';
  let el = document.querySelector('#el');
  let name = new ListenerGenerator(el, {}, helpers.vnode(), {})._resolveFieldName();
  t.is(name, 'field');

  // using data attribute.
  document.body.innerHTML = '<input id="el" type="text" data-vv-name="dataName">';
  el = document.querySelector('#el');
  name = new ListenerGenerator(el, {}, helpers.vnode(), {})._resolveFieldName();
  t.is(name, 'dataName');

  // using arg does not affect the field name.
  name = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {})._resolveFieldName();
  t.is(name, 'dataName');

  // using component attribute.
  let cgl = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {});
  cgl.component = { name: 'componentName' };
  // it will use the data-vv-name then the name property of the component if it exists.
  t.is(cgl._resolveFieldName(), 'dataName');

  // No data-vv-name.
  document.body.innerHTML = '<input id="el" type="text">';
  el = document.querySelector('#el');
  cgl = new ListenerGenerator(el, { arg: 'expressedName' }, helpers.vnode(), {});
  cgl.component = { name: 'componentName' };
  t.is(cgl._resolveFieldName(), 'componentName');
});

test('can generate a scoped listener', t => {
  document.body.innerHTML = '<input id="el" type="text" name="name" data-vv-scope="scope1">';
  const el = document.querySelector('#el');
  const scopedCallback = new ListenerGenerator(el, {}, helpers.vnode(), {})._getScopedListener(() => {
    throw 'Oops!';
  });

  // no scope, yep.
  let error = t.throws(() => {
    scopedCallback();
  });
  t.is(error, 'Oops!');

  // same scope, yep.
  error = t.throws(() => {
    scopedCallback('scope1');
  });
  t.is(error, 'Oops!');

  // different scope, nope.
  t.notThrows(() => {
    scopedCallback('scope2');
  });
});

test('resolves value getters for text inputs', t => {
  document.body.innerHTML = '<input id="el" type="text" name="name" value="val">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const { context, getter } = lg._resolveValueGetter();

  t.is(context(), el);
  t.is(getter(el), 'val');
  el.value = 'notval';
  t.is(getter(context()), 'notval');
});

test('resolves value getters for file inputs', t => {
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

  t.is(context(), el);
  t.deepEqual(getter(context()), el.files);
  el.files.push(helpers.file('another.jpg', 'image/jpg'));
  t.deepEqual(getter(context()), el.files);
});

test('resolves value getters for components', t => {
  document.body.innerHTML = '<input id="el" type="text" name="name" value="1" data-vv-value-path="internalValue">';
  const el = document.querySelector('#el');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg.component = { $el: el, value: 'first' };
  const { context, getter } = lg._resolveValueGetter();

  t.is(context(), lg.component);
  t.is(getter(context()), 'first');
  lg.component.value = 'second'; // simulate change.
  t.is(getter(context()), 'second');
});

test('resolves value getters for checkboxes', t => {
  document.body.innerHTML = `
      <div>
          <input id="el1" type="checkbox" name="name" value="1" checked>
          <input id="el2" type="checkbox" name="name" value="2">
      </div>`;
  const el = document.querySelector('#el1');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const { context, getter } = lg._resolveValueGetter();
  t.deepEqual(getter(context()), ['1']);
  document.body.innerHTML = `
      <div>
          <input id="el1" type="checkbox" name="name" value="1" checked>
          <input id="el2" type="checkbox" name="name" value="2" checked>
      </div>`;
  t.deepEqual(getter(context()), ['1', '2']);
  document.body.innerHTML = `
      <div>
          <input id="el1" type="checkbox" name="name" value="1">
          <input id="el2" type="checkbox" name="name" value="2">
      </div>`;
  t.is(getter(context()), null);
});

test('resolves value getters for radio inputs', t => {
  document.body.innerHTML = `
      <div>
          <input id="el1" type="radio" name="name" value="1" checked>
          <input id="el2" type="radio" name="name" value="2">
      </div>`;
  const el = document.querySelector('#el1');
  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  const { context, getter } = lg._resolveValueGetter();
  t.is(getter(context()), '1');

  document.body.innerHTML = `
      <div>
          <input id="el1" type="radio" name="name" value="1">
          <input id="el2" type="radio" name="name" value="2" checked>
      </div>`;
  t.is(getter(context()), '2');
  document.body.innerHTML = `
      <div>
          <input id="el1" type="radio" name="name" value="1">
          <input id="el2" type="radio" name="name" value="2">
      </div>`;
  t.is(getter(context()), null);
});

test('can handle text input event', t => {
  document.body.innerHTML = '<input id="el" type="text" name="field" value="1">';
  const el = document.querySelector('#el');
  t.throws(() => {
    new ListenerGenerator(el, {}, helpers.vnode(), {})._inputListener();
  });
});

test.cb('can handle file change event', t => {
  t.plan(1);
  document.body.innerHTML = '<input id="el" type="file" name="field" value="files.jpg">';
  const el = document.querySelector('#el');
  new ListenerGenerator(el, { modifiers: { reject: true } }, helpers.vnode(false), {})._fileListener().then(() => {
    t.is(el.value, ''); // test reject.
    t.end();
  });
});

test('can handle radio input change', t => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
        <input id="el" type="radio" name="field" value="1" checked>
        <input id="el2" type="radio" name="field" value="2">
    `;
  const el = document.querySelector('#el');
  let error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._radioListener();
  });
  t.is(error, '1');
  document.body.innerHTML = `
        <input id="el" type="radio" name="field" value="1">
        <input id="el2" type="radio" name="field" value="2" checked>
    `;
  error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._radioListener();
  });
  t.is(error, '2');
});

test('can handle checkboxes input change', t => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
        <input id="el" type="checkbox" name="field" value="1" checked>
        <input id="el2" type="checkbox" name="field" value="2">
    `;
  const el = document.querySelector('#el');
  let error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  });
  t.is(error, '1');
  document.body.innerHTML = `
        <input id="el" type="checkbox" name="field" value="1">
        <input id="el2" type="checkbox" name="field" value="2" checked>
    `;
  error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  });
  t.is(error, '2');
  document.body.innerHTML = `
        <input id="el" type="checkbox" name="field" value="1" checked>
        <input id="el2" type="checkbox" name="field" value="2" checked>
    `;
  error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  });
  t.is(error, '1');
  document.body.innerHTML = '';
  error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  });
  t.is(error, 'null');

  document.body.innerHTML = `
        <input id="el" type="checkbox" name="field" value="1">
        <input id="el2" type="checkbox" name="field" value="2">
    `;

  error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._checkboxListener();
  });
  t.is(error, 'null');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(false), {});
  document.body.innerHTML = '';
  t.falsy(lg._checkboxListener());
});

test('can handle select fields value change', t => {
  const vnode = helpers.vnode();
  document.body.innerHTML = `
        <select id="el" name="field">
            <option value="val1" checked>1</option>
            <option value="val2">2</option>
        </select>
    `;

  const el = document.querySelector('#el');
  t.deepEqual(
      new ListenerGenerator(el, {}, vnode, {})._getSuitableListener().names,
      ['change', 'blur']
    );

  const error = t.throws(() => {
    new ListenerGenerator(el, {}, vnode, {})._inputListener();
  });
  t.is(error, 'val1');
});

test('can handle component input event', t => {
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
  const error = t.throws(() => {
    lg.component = mockedComponent;
    lg.attach();
  });
  t.is(error, 'something');

  vnode = helpers.vnode();
  lg = new ListenerGenerator(el, helpers.binding(), vnode, {});
  lg.component = {
    $on(whatever, callback) {
      lg.component.onInput = (value) => { callback(value); };
    },
    $watch() {}
  };
  t.falsy(lg._attachComponentListeners());
  t.truthy(lg.component.onInput);
});

test('should attach additional listeners for rules with dependent fields', t => {
  document.body.innerHTML = `<div id="app">
      <input type="text" name="field" id="el" data-vv-rules="confirmed:other">
      <input type="text" name="other" id="other" data-vv-rules="confirmed:other">
  </div>`;
  const el = document.querySelector('#el');
  const vnode = helpers.vnode();

  const lg = new ListenerGenerator(el, {}, vnode, {});
  lg._attachValidatorEvent();
  t.truthy(~lg.callbacks.map(c => c.el.name).indexOf('other'));
});

test('should not attach listeners for rules with dependent fields that do not exist', t => {
  document.body.innerHTML = `<div id="app">
      <input type="text" name="field" id="el" data-vv-rules="confirmed:other">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachValidatorEvent();

  t.falsy(~lg.callbacks.map(c => c.el.name).indexOf('other'));
});

test('should attach a listener for each radio element', t => {
  document.body.innerHTML = `<div id="app">
      <input type="radio" name="field" id="el" value="1">
      <input type="radio" name="field" value="2">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachFieldListeners();
  t.is(lg.callbacks.filter(c => c.el.name === 'field').length, 2);
});


test('should attach a listener for each checkbox element', t => {
  document.body.innerHTML = `<div id="app">
      <input type="checkbox" name="field" id="el" value="1">
      <input type="checkbox" name="field" value="2">
  </div>`;
  const el = document.querySelector('#el');

  const lg = new ListenerGenerator(el, {}, helpers.vnode(), {});
  lg._attachFieldListeners();
  t.is(lg.callbacks.filter(c => c.el.name === 'field').length, 2);
});

test('detaches listeners', t => {
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

  let error = t.throws(() => { lg.detach(); });
  t.is(error, 'offed listener');
  throws.off = false;
  error = t.throws(() => { lg.detach(); });
  t.is(error, 'unwatched');
  throws.unwatch = false;

  lg.callbacks.push({ el, name: 'input', listener: () => {} });
  t.is(lg.callbacks.length, 1);
  lg.detach();
  t.is(calls, 1);
});
