import * as utils from '../src/utils';

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
  const arr = [
      { el: 'name' },
      { el: 'email' },
      { el: 'address' },
      { el: 'something' },
      { el: 'else' }
  ];
  expect(find(arr, e => e.el === 'name').el).toBe('name');
  arr.find = undefined;
  expect(find(arr, e => e.el === 'else').el).toBe('else');
});

test('should return valid rules data', () => {
  const getRules = utils.getRules;
  document.body.innerHTML = '<input type="text" name"el" id="el" data-vv-rules="required|email">';
  const el = document.querySelector('#el');
  expect(getRules(null, null, el)).toBe('required|email');

  const exp = 'someexpr';
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

test('assigns objects', () => {
  const o1 = { a: 1, b: 1, c: 1 };
  const o2 = { b: 2, c: 2 };
  const o3 = { c: 3 };
  const result = { a: 1, b: 2, c: 3 };
  expect(utils.assign({}, o1, o2, o3)).toEqual(result);
  expect(() => {
    utils.assign(null, o1);
  }).toThrow();
});

test('removes classes', () => {
  document.body.innerHTML = '<input id="el" type="text" class="some class">';
  const el = document.querySelector('#el');
  utils.removeClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(false);
  el.classList = undefined;
  utils.removeClass(el, 'class');
  expect(utils.hasClass(el, 'class')).toBe(false);
});

test('adds classes', () => {
  document.body.innerHTML = '<input id="el" type="text">';
  const el = document.querySelector('#el');
  utils.addClass(el, 'some');
  expect(utils.hasClass(el, 'some')).toBe(true);
  el.classList = undefined;

  expect(utils.hasClass(el, 'class')).toBe(false);
  utils.addClass(el, 'class');
  expect(utils.hasClass(el, 'class')).toBe(true);
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
});


test('gets the value path with a fallback value', () => {
  const some = {
    value: {
      path: undefined,
      val: 1
    }
  };

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
  }, 200);

  func(value, argument);
  setTimeout(() => {
    done();
  }, 201);
});


test('calls functions immediatly if time is 0', done => {
  const [value, argument] = ['someval', 'somearg'];
  const func = utils.debounce((val, arg) => {
    expect(val).toBe(value);
    expect(arg).toBe(argument);
    done();
  }, 0);

  func(value, argument);
});
