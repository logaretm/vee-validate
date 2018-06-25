import Resolver from '@/core/resolver';

test('resolves delay', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-delay="100">
  `;
  const vnode = { componentInstance: { $attrs: { 'data-vv-delay': '200' } } };
  let el = document.querySelector('#el');
  expect(Resolver.resolveDelay(el, {})).toBe(100);

  // fills the delay object if the global delay is an object of events.
  expect(Resolver.resolveDelay(el, {}, { delay: { input: 300, blur: 300 } })).toEqual({
    blur: 300,
    input: 100
  });

  el = { getAttribute: () => null };
  expect(Resolver.resolveDelay(el, vnode)).toBe(200);
  expect(Resolver.resolveDelay(el, {}, { delay: '300' })).toBe(300);
})

describe('resolves the rules', () => {
  document.body.innerHTML = `
    <input type="text" name="el" id="el" data-vv-rules="required|email">
  `;
  const el = document.querySelector('#el');

  test('using data-vv-rules attribute', () => {
    expect(Resolver.resolveRules(el, {}, {})).toBe('required|email');
  });

  test('using directive expression', () => {
    const directive = {
      value: 'required|email'
    };

    expect(Resolver.resolveRules(el, directive, {})).toBe('required|email');
  });

  test('using nested rules in directive expression', () => {
    const directive = {
      value: {
        rules: {
          required: true,
          email: true
        }
      }
    };

    expect(Resolver.resolveRules(el, directive, {})).toEqual({
      required: true,
      email: true
    });
  });

  test('using HTML5 validation Attributes', () => {
    const input = document.createElement('input');
    const resolve = (el) => Resolver.resolveRules(el, {}, {})
    input.type = 'email';
    input.required = true;

    expect(resolve(input)).toBe('required|email');

    input.type = 'number';
    input.required = false;
    input.min = 10;
    input.max = 20;
    expect(resolve(input)).toBe('decimal|min_value:10|max_value:20');

    input.type = 'date';
    expect(resolve(input)).toBe('date_format:YYYY-MM-DD');

    input.type = 'datetime-local';
    expect(resolve(input)).toBe('date_format:YYYY-MM-DDTHH:mm');

    input.type = 'week';
    expect(resolve(input)).toBe('date_format:YYYY-[W]WW');

    input.type = 'month';
    expect(resolve(input)).toBe('date_format:YYYY-MM');

    input.type = 'time';
    expect(resolve(input)).toBe('date_format:HH:mm');

    input.step = 10;
    expect(resolve(input)).toBe('date_format:HH:mm:ss');

    input.type = 'text';
    input.pattern = '^[0-9]+$';
    expect(resolve(input)).toBe('regex:^[0-9]+$');
    input.pattern = '';

    input.maxLength = 10;
    input.type = 'text';
    expect(resolve(input)).toBe('max:10');

    input.minLength = 2;
    expect(resolve(input)).toBe('max:10|min:2');
  });
});
