import Generator from '../../src/core/generator';

test('resolves delay', () => {
  document.body.innerHTML = `
    <input type="text" name="field" id="el" v-model="email" data-vv-delay="100">
  `;
  const vnode = { child: { $attrs: { 'data-vv-delay': '200' } } };
  let el = document.querySelector('#el');
  expect(Generator.resolveDelay(el, {})).toBe(100);

  // fills the delay object if the global delay is an object of events.
  expect(Generator.resolveDelay(el, {}, { delay: { input: 300, blur: 300 } })).toEqual({
    blur: 300,
    input: 100
  });

  el = { getAttribute: () => null };
  expect(Generator.resolveDelay(el, vnode)).toBe(200);
  expect(Generator.resolveDelay(el, {}, { delay: '300' })).toBe(300);
})

describe('resolves the rules', () => {
  document.body.innerHTML = `
    <input type="text" name="el" id="el" data-vv-rules="required|email">
  `;
  const el = document.querySelector('#el');

  test('using data-vv-rules attribute', () => {
    expect(Generator.resolveRules(el, {})).toBe('required|email');
  });

  test('using directive expression', () => {
    const directive = {
      value: 'required|email'
    };

    expect(Generator.resolveRules(el, directive)).toBe('required|email');
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
  
    expect(Generator.resolveRules(el, directive)).toEqual({
      required: true,
      email: true
    });
  });
});
