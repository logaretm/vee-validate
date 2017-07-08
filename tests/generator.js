import Generator from '../src/generator';

test('resolves the bound model', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email">
  `;
  const el = document.querySelector('#el');

  // watchable model.
  let vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(new Generator(el, { arg: null, value: null }, vnode).resolveModel()).toBe('email');

  // watchable directive arg
  vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(new Generator(el, { arg: 'email', value: null }, vnode).resolveModel()).toBe('email');

  // watchable expression arg
  vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(new Generator(el, { arg: null, value: { arg: 'email' } }, vnode).resolveModel()).toBe('email');

  // old model when was included in directives array.
  vnode = { context: { email: '' }, data: { directives: [{ name: 'model', expression: 'email' }] } };
  expect(new Generator(el, {}, vnode).resolveModel()).toBe('email');


  // unresolvable.
  vnode = { context: { email: '' }, data: { directives: [] } };
  expect(new Generator(el, {}, vnode).resolveModel()).toBe(null);

  // unwatchable model because it does not exist on the vm (context).
  vnode = { context: {}, data: { model: { expression: 'email' } } };
  expect(new Generator(el, { arg: null, value: null }, vnode).resolveModel()).toBe(null);
  
  // Part of a `v-for` cannot be watched by the $watch API.
  vnode = { context: {}, data: { model: { expression: 'emails[0]' } } };
  expect(new Generator(el, { arg: null, value: null }, vnode).resolveModel()).toBe(null);  

});

test('resolves the input scope', () => {
  // defined on element.
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-scope="s1">
  `;
  let el = document.querySelector('#el');
  const vnode = { context: { email: '' }, data: { model: { expression: 'email' } } };
  expect(new Generator(el, { arg: null, value: null }, vnode).resolveScope()).toBe('s1');

  // defined on form.
  document.body.innerHTML = `
    <form data-vv-scope="s2">
      <input type="text" name="field" id="el" v-model="email">
    </form>
  `;
  el = document.querySelector('#el');
  expect(new Generator(el, { arg: null, value: null }, vnode).resolveScope()).toBe('s2');

  // defined in expression.
  el = document.querySelector('#el');
  expect(new Generator(el, { arg: null, value: { scope: 's3'} }, vnode).resolveScope()).toBe('s3');
});

describe('resolves the value getters', () => {
  test('resolves for text fields', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" value="somevalue">
    `;
    let el = document.querySelector('#el');
    let vnode = { context: { email: '' }, data: {} };
    const getter = new Generator(el, {}, vnode).resolveGetter();
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
    const getter = new Generator(els[0], {}, vnode).resolveGetter();

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
    const getter = new Generator(els[0], {}, vnode).resolveGetter();
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
    const getter = new Generator(el, {}, vnode).resolveGetter();
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
    const getter = new Generator(el, {}, vnode).resolveGetter();
    expect(getter()).toEqual(['2', '3']);
  });

  test('resolves for file inputs', () => {
    document.body.innerHTML = `
      <input id="el" type="file">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    const getter = new Generator(el, {}, vnode).resolveGetter();
    expect(getter()).toEqual([]);
  });

  test('it resolves for a model bound field', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" v-model="email">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: 'example@example.com' }, data: { model: { expression: 'email' } } };
    const generator = new Generator(el, { arg: null, value: null }, vnode);
    generator.resolveModel(); // model must be resolved first.
    const getter = generator.resolveGetter();
    expect(getter()).toBe('example@example.com');
    vnode.context.email = 'other@example.com';
    expect(getter()).toBe('other@example.com');
  });

  test('it resolves for a custom component', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el" data-vv-value-path="someval">
    `;
    let el = document.querySelector('#el');
    const vnode = { context: {}, child: { someval: 'test', value: 'test2' }, data: {} };
    const generator = new Generator(el, { arg: null, value: null }, vnode);
    const getter = generator.resolveGetter();
    expect(getter()).toBe('test');
    vnode.child.someval = 'changed';
    expect(getter()).toBe('changed');

    // test fallback to value property.
    el.setAttribute('data-vv-value-path', '');
    expect(getter()).toBe('test2');
    vnode.child.value = 'changed';
    expect(getter()).toBe('changed');
  });
});

describe('resolves the field name', () => {
  test('using name attribute', () => {
    document.body.innerHTML = `
      <input type="text" name="field" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: { email: '' }, data: {} };
    expect(new Generator(el, { arg: null, value: null }, vnode).resolveName()).toBe('field');
  });

  test('using data-vv-name attribute', () => {
    document.body.innerHTML = `
      <input type="text" data-vv-name="field" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: {}, data: {} };
    expect(new Generator(el, { arg: null, value: null }, vnode).resolveName()).toBe('field');
  });

  test('component name property if exists', () => {
    document.body.innerHTML = `
      <input type="text" id="el">
    `;
    const el = document.querySelector('#el');
    const vnode = { context: {}, child: { name: 'component' }, data: {} };
    expect(new Generator(el, {}, vnode).resolveName()).toBe('component');
    el.setAttribute('data-vv-name', 'field'); // data-vv-name takes priority.
    vnode.child.name = null;
    expect(new Generator(el, {}, vnode).resolveName()).toBe('field');
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
    vm: vnode.context,
    component: undefined,
    classes: false,
    classNames: undefined,
    expression: 'required|max:3',
    rules: 'required|max:3',
    initial: false,
    invalidateFalse: false,
    alias: null,
    el
  });
});