import test from 'ava';
import * as utils from '../src/utils';

test('gets the data attribute prefixed with the plugin', t => {
  document.body.innerHTML =
      `<div>
          <input id="el" type="text" name="field" data-vv-rules="required" data-vv-delay="100">
      </div>`;

  const el = document.querySelector('#el');

  t.is(utils.getDataAttribute(el, 'rules'), 'required');
  t.is(utils.getDataAttribute(el, 'delay'), '100');
  t.is(utils.getDataAttribute(el, 'as'), null);
});

test('gets the element scope from the element or from the owning form', t => {
  document.body.innerHTML =
      `<div>
          <input id="el" type="text" name="field" data-vv-scope="scope1">
      </div>`;
  let el = document.querySelector('#el');
  t.is(utils.getScope(el), 'scope1');

  document.body.innerHTML =
      `<form data-vv-scope="form-scope">
          <input id="el" type="text" name="field">
      </form>`;
  el = document.querySelector('#el');
  t.is(utils.getScope(el), 'form-scope');
});

test('checks if a value is an object', t => {
  t.false(utils.isObject(null));
  t.false(utils.isObject([]));
  t.false(utils.isObject('someval'));
  t.true(utils.isObject({}));
});

test('returns first matching element from array', t => {
  const find = utils.find;
  const arr = [
      { el: 'name' },
      { el: 'email' },
      { el: 'address' },
      { el: 'something' },
      { el: 'else' }
  ];
  t.is(find(arr, e => e.el === 'name').el, 'name');
  arr.find = undefined;
  t.is(find(arr, e => e.el === 'else').el, 'else');
});

test('should return valid rules data', t => {
  const getRules = utils.getRules;
  document.body.innerHTML = '<input type="text" name"el" id="el" data-vv-rules="required|email">';
  const el = document.querySelector('#el');
  t.is(getRules(null, null, el), 'required|email');

  const exp = 'someexpr';
  let value = 'required|email';

  t.is(getRules(exp, value), 'required|email');

  value = {
    rules: {
      required: true,
      email: true
    }
  };

  t.deepEqual(getRules(exp, value), {
    required: true,
    email: true
  });

  value = {
    required: true,
    email: true
  };

  t.deepEqual(getRules(exp, value), {
    required: true,
    email: true
  });
});

test('assigns objects', t => {
  const o1 = { a: 1, b: 1, c: 1 };
  const o2 = { b: 2, c: 2 };
  const o3 = { c: 3 };
  const result = { a: 1, b: 2, c: 3 };
  t.deepEqual(utils.assign({}, o1, o2, o3), result);
  t.throws(() => {
    utils.assign(null, o1);
  });

  // Test polyfill
  const assign = Object.assign;
  Object.assign = undefined;
  t.deepEqual(utils.assign({}, o1, o2, o3), result);
  t.throws(() => {
    utils.assign(null, o1);
  });
  Object.assign = assign;
});

test('removes classes', t => {
  document.body.innerHTML = '<input id="el" type="text" class="some class">';
  const el = document.querySelector('#el');
  utils.removeClass(el, 'some');
  t.is(utils.hasClass(el, 'some'), false);
  el.classList = undefined;
  utils.removeClass(el, 'class');
  t.is(utils.hasClass(el, 'class'), false);
});

test('adds classes', t => {
  document.body.innerHTML = '<input id="el" type="text">';
  const el = document.querySelector('#el');
  utils.addClass(el, 'some');
  t.is(utils.hasClass(el, 'some'), true);
  el.classList = undefined;

  t.is(utils.hasClass(el, 'class'), false);
  utils.addClass(el, 'class');
  t.is(utils.hasClass(el, 'class'), true);
});

test('converts array like objects to arrays', t => {
  document.body.innerHTML = `
        <div class="class"></div>
        <div class="class"></div>
        <div class="class"></div>
    `;

  const nodeList = document.querySelectorAll('.class');
  t.false(Array.isArray(nodeList));

  let array = utils.toArray(nodeList);
  t.true(Array.isArray(array));

    // Test polyfill
  Array.from = undefined;
  array = utils.toArray(nodeList);
  t.true(Array.isArray(array));
});


test('gets the value path with a fallback value', t => {
  const some = {
    value: {
      path: undefined,
      val: 1
    }
  };

  t.is(utils.getPath('value.val', some), 1); // exists.
  t.is(utils.getPath('value.path', some), undefined); // undefined but exists.
  t.false(utils.getPath('value.not', some, false)); // does not.
});
