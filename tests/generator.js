import Generator from '../src/core/generator';

test('resolves the bound model', () => {
  // watchable model.
  let vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(Generator.resolveModel({ arg: null, value: null }, vnode)).toBe('email');

  // watchable directive arg
  vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(Generator.resolveModel({ arg: 'email', value: null }, vnode)).toBe('email');

  // watchable expression arg
  vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(Generator.resolveModel({ arg: null, value: { arg: 'email' } }, vnode)).toBe('email');

  // old model when was included in directives array.
  vnode = { context: { email: '' }, data: { directives: [{ name: 'model', expression: 'email' }] } };
  expect(Generator.resolveModel({}, vnode)).toBe('email');


  // unresolvable.
  vnode = { context: { email: '' }, data: { directives: [] } };
  expect(Generator.resolveModel({}, vnode)).toBe(null);

  // unwatchable model because it does not exist on the vm (context).
  vnode = { context: {}, data: { model: { expression: 'email' } } };
  expect(Generator.resolveModel({ arg: null, value: null }, vnode)).toBe(null);

  // Part of a `v-for` cannot be watched by the $watch API.
  vnode = { context: {}, data: { model: { expression: 'emails[0]' } } };
  expect(Generator.resolveModel({ arg: null, value: null }, vnode)).toBe(null);
});

test('resolves the input scope', () => {
  // defined on element.
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-scope="s1">
  `;
  let el = document.querySelector('#el');
  let vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(Generator.resolveScope(el, { arg: null, value: null })).toBe('s1');

  // defined on form.
  document.body.innerHTML = `
    <form data-vv-scope="s2">
      <input type="text" name="field" id="el" v-model="email">
    </form>
  `;
  el = document.querySelector('#el');
  expect(Generator.resolveScope(el, { arg: null, value: null })).toBe('s2');

  // defined in expression.
  el = document.querySelector('#el');
  expect(Generator.resolveScope(el, { arg: null, value: { scope: 's3'} })).toBe('s3');

  el = document.querySelector('#el');
  expect(Generator.resolveScope(el, { arg: null, value: { scope: 0} })).toBe(0);

  // defined in a components $attrs.
  el = document.querySelector('#el');
  vnode = { child: { $attrs: { 'data-vv-scope': 's4' } } };
  expect(Generator.resolveScope(el, { arg: null, value: null }, vnode)).toBe('s4');

  // define in a component's $el
  vnode = { child: { $attrs: {} } };
  expect(Generator.resolveScope(el, { arg: null, value: null }, vnode)).toBe('s2');
});

test('resolves delay', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-delay="100">
  `;
  const vnode = { child: { $attrs: { 'data-vv-delay': '200' } } };
  let el = document.querySelector('#el');
  expect(Generator.resolveDelay(el, {})).toEqual(expect.objectContaining({ local: { input: 100 } }));

  el = { getAttribute: () => null };
  expect(Generator.resolveDelay(el, vnode)).toEqual(expect.objectContaining({ local: { input: 200 } }));
  expect(Generator.resolveDelay(el, {}, { delay: '300' })).toEqual({ global: 300 });
})

test('resolves events', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-validate-on="input">
  `;
  let el = document.querySelector('#el');
  const vnode = { child: { $attrs: { 'data-vv-validate-on': 'focus' } } };
  expect(Generator.resolveEvents(el, {})).toBe("input");
  el = { getAttribute: () => null };

  expect(Generator.resolveEvents(el, vnode)).toBe("focus");
});

describe('resolves the value getters', () => {
  test('resolves for text fields', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" value="somevalue">
    `;
    let el = document.querySelector('#el');
    let vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(el, vnode);
    expect(
      getter()
    ).toBe('somevalue');
  });

  test('resolves for radio inputs', () => {
    document.body.innerHTML = `
      <input type="radio" name="field" id="el1" value="some">
      <input type="radio" name="field" id="el2" value="other">
      <input type="radio" name="field" id="el3" value="value">
    `;

    const els = [
      document.querySelector('#el1'),
      document.querySelector('#el2'),
      document.querySelector('#el3')
    ];
    const vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(els[0], vnode);

    // none checked.
    expect(
      getter()
    ).toBe(undefined);

    els[0].checked = true;
    expect(
      getter()
    ).toBe('some');


    els[1].checked = true;
    expect(
      getter()
    ).toBe('other');


    els[2].checked = true;
    expect(
      getter()
    ).toBe('value');
  });

  test('resolves for checkboxes', () => {
    document.body.innerHTML = `
      <input type="checkbox" name="field[]" id="el1" value="some">
      <input type="checkbox" name="field[]" id="el2" value="other">
      <input type="checkbox" name="field[]" id="el3" value="value">
    `;

    const els = [
      document.querySelector('#el1'),
      document.querySelector('#el2'),
      document.querySelector('#el3')
    ];
    const vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(els[0], vnode);
    // none checked.
    expect(
      getter()
    ).toBe(undefined);

    els[0].checked = true;
    expect(
      getter()
    ).toEqual(['some']);

    els[1].checked = true;
    expect(
      getter()
    ).toEqual(['some', 'other']);

    els[2].checked = true;
    expect(
      getter()
    ).toEqual(['some', 'other', 'value']);
  });

  test('resolves for select one field', () => {
    document.body.innerHTML = `
      <select type="text" name="field" id="el">
        <option value="1">1</option>
        <option selected value="2">2</option>
        <option value="3">3</option>
      </select>
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(el, vnode);
    expect(getter()).toBe('2');
  });

  test('resolves for select multiple field', () => {
    document.body.innerHTML = `
      <select type="text" name="field" id="el" multiple>
        <option value="1">1</option>
        <option selected value="2">2</option>
        <option selected value="3">3</option>
      </select>
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(el, vnode);
    expect(getter()).toEqual(['2', '3']);
  });

  test('resolves for file inputs', () => {
    document.body.innerHTML = `
      <input id="el" type="file">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    const getter = Generator.resolveGetter(el, vnode);
    expect(getter()).toEqual([]);
  });

  test('it resolves for a model bound field', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" v-model="email">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: 'example@example.com' }, data: { model: { expression: 'email' } } };
    const model = Generator.resolveModel({ arg: null, value: null }, vnode); // model must be resolved first.
    const getter = Generator.resolveGetter(el, vnode, model);
    expect(getter()).toBe('example@example.com');
    vnode.context.email = 'other@example.com';
    expect(getter()).toBe('other@example.com');
  });

  test('it resolves for a custom component', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" data-vv-value-path="someval">
    `;
    let el = document.querySelector('#el');
    const vnode = { context: {}, child: { someval: 'test', value: 'test2', third: 33 }, data: {} };
    let getter = Generator.resolveGetter(el, vnode);
    expect(getter()).toBe('test');
    vnode.child.someval = 'changed';
    expect(getter()).toBe('changed');

    // test fallback to value property.
    el.setAttribute('data-vv-value-path', '');
    getter = Generator.resolveGetter(el, vnode);
    expect(getter()).toBe('test2');
    vnode.child.value = 'changed';
    expect(getter()).toBe('changed');
    delete vnode.child.value;

    vnode.child.$attrs = { 'data-vv-value-path': 'third' };
    expect(Generator.resolveGetter(el, vnode)()).toBe(33);
  });
});

test('resolves the rules', () => {
  document.body.innerHTML = `
    <input type="text" name="el" id="el" data-vv-rules="required|email">
  `;
  const el = document.querySelector('#el');
  expect(Generator.resolveRules(el, {})).toBe('required|email');

  const expression = 'someexpr';
  let value = 'required|email';

  expect(Generator.resolveRules(el, { expression, value })).toBe('required|email');

  value = {
    rules: {
      required: true,
      email: true
    }
  };

  expect(Generator.resolveRules(el, { expression, value })).toEqual({
    required: true,
    email: true
  });

  value = {
    required: true,
    email: true
  };

  expect(Generator.resolveRules(el, { expression, value })).toEqual({
    required: true,
    email: true
  });
});

describe('resolves the field name', () => {
  test('using name attribute', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    expect(Generator.resolveName(el, vnode)).toBe('field');
  });

  test('using data-vv-name attribute', () => {
    document.body.innerHTML = `
      <input type="text" data-vv-name="field" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: {}, data: {} };
    expect(Generator.resolveName(el, vnode)).toBe('field');
  });

  test('custom component names', () => {
    document.body.innerHTML = `
      <input type="text" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: {}, child: { name: 'component' }, data: {} };
    expect(Generator.resolveName(el, vnode)).toBe('component');
    el.setAttribute('data-vv-name', 'field'); // data-vv-name takes priority.
    vnode.child.name = null;
    expect(Generator.resolveName(el, vnode)).toBe('field');
    el.setAttribute('data-vv-name', ''); // data-vv-name takes priority.
    vnode.child.$attrs = { 'data-vv-name': 'attrName' }; // simulate Vue's 2.4 inheritAttrs set to false.
    expect(Generator.resolveName(el, vnode)).toBe('attrName');

    // if it doesn't expose the name as a prop in Vue 2.4+
    vnode.child.$attrs = { "name": "attrName1" };
    expect(Generator.resolveName(el, vnode)).toBe("attrName1");
  });
});

test('generates field options', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-scope="s1">
  `;
  const el = document.querySelector('#el');
  const vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(Generator.generate(el, { expression: true, value: 'required|max:3', modifiers: {} }, vnode)).toMatchObject({
    name: 'field',
    scope: 's1',
    model: 'email',
    vm: {},
    component: undefined,
    classes: false,
    classNames: null,
    expression: 'required|max:3',
    rules: 'required|max:3',
    initial: false,
    el
  });
});

test('generates fake vm', () => {
  const vnode = {
    context: {
      $el: 'this is an el',
      $refs: { myref: 1 },
      $watch: jest.fn(),
      $validator: {
        validate: jest.fn(),
        errors: {},
        update: jest.fn()
      }
    }
  };

  const vm = Generator.makeVM(vnode.context);
  expect(vm.$el).toBe('this is an el');
  expect(vm.$refs.myref).toBe(1);
});
