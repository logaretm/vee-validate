import Resolver from '@/core/resolver';
import { createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';

const Vue = createLocalVue();
Vue.use(VeeValidate, { inject: false, validity: true });

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
});

describe('resolves the rules', () => {
  document.body.innerHTML = `
    <input type="text" name="el" id="el" data-vv-rules="required|email">
  `;
  const el = document.querySelector('#el');

  test('using data-vv-rules attribute', () => {
    expect(Resolver.resolveRules(el, {}, {})).toEqual({
      required: [],
      email: []
    });
  });

  test('using directive expression', () => {
    const directive = {
      value: 'required|email'
    };

    expect(Resolver.resolveRules(el, directive, {})).toEqual({
      required: [],
      email: []
    });
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
      required: [],
      email: []
    });
  });

  // tests #1706
  test('directive rules take precendence over HTML5 validation attrs', () => {
    const input = document.createElement('input');
    input.type = 'number';
    const resolve = (el) => Resolver.resolveRules(el, { value: 'decimal:4' }, {});

    expect(resolve(input)).toEqual({ decimal: ['4'] });
  });

  test('rule inference can be disabled with validity option', () => {
    const input = document.createElement('input');
    input.type = 'number';
    VeeValidate.configure({ validity: false });
    const resolve = (el) => Resolver.resolveRules(el, { value: 'required' }, {});

    expect(resolve(input)).toEqual({ required: [] });
    VeeValidate.configure({ validity: true });
  });

  test('using HTML5 validation Attributes', () => {
    const input = document.createElement('input');
    const resolve = (el) => Resolver.resolveRules(el, {}, {});
    input.type = 'email';
    input.required = true;

    expect(resolve(input)).toEqual({ required: [], email: [] });

    input.type = 'number';
    input.required = false;
    input.min = 10;
    input.max = 20;
    expect(resolve(input)).toEqual({ min_value: ['10'], max_value: ['20'], decimal: [] });

    input.type = 'date';
    expect(resolve(input)).toEqual({ date_format: ['YYYY-MM-DD'] });

    input.type = 'datetime-local';
    expect(resolve(input)).toEqual({ date_format: ['YYYY-MM-DDTHH:mm'] });

    input.type = 'week';
    expect(resolve(input)).toEqual({ date_format: ['YYYY-[W]WW'] });

    input.type = 'month';
    expect(resolve(input)).toEqual({ date_format: ['YYYY-MM'] });

    input.type = 'time';
    expect(resolve(input)).toEqual({ date_format: ['HH:mm'] });

    input.step = 10;
    expect(resolve(input)).toEqual({ date_format: ['HH:mm:ss'] });

    input.type = 'text';
    input.pattern = '(^[0-9]+|s)$';
    expect(resolve(input)).toEqual({ regex: ['(^[0-9]+|s)$'] });
    input.pattern = '';

    input.maxLength = 10;
    input.type = 'text';
    expect(resolve(input)).toEqual({ max: ['10'] });

    input.minLength = 2;
    expect(resolve(input)).toEqual({ max: ['10'], min: ['2'] });
  });
});
