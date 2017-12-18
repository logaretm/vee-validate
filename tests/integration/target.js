import { mount, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import InputComponent from './components/stubs/Input';
import TestComponent from './components/Targets';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('native HTML elements targeting via name selector', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  let input = wrapper.find('#f1');
  let target = wrapper.find('#f2');

  input.element.value = '10';
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.first('f1')).toBe('The f1 confirmation does not match.');
  target.element.value = '10';
  target.trigger('input');
  await flushPromises();

  const field = wrapper.vm.$validator.fields.find({ name: 'f1' });

  expect(wrapper.vm.$validator.errors.has('f1')).toBe(false);
  expect(wrapper.vm.$validator.flags.f1.valid).toBe(true);
});

test('native HTML elements targeting via id selectors', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  let input = wrapper.find('#f3');
  let target = wrapper.find('#f4');

  input.element.value = '10';
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.first('f3')).toBe('The f3 confirmation does not match.');
  target.element.value = '10';
  target.trigger('input');
  await flushPromises();

  const field = wrapper.vm.$validator.fields.find({ name: 'f3' });

  expect(wrapper.vm.$validator.errors.has('f3')).toBe(false);
  expect(wrapper.vm.$validator.flags.f3.valid).toBe(true);
});

test('native HTML elements targeting via class selectors', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  let input = wrapper.find('#f5');
  let target = wrapper.find('.f6');

  input.element.value = '10';
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.first('f5')).toBe('The f5 confirmation does not match.');
  target.element.value = '10';
  target.trigger('input');
  await flushPromises();

  const field = wrapper.vm.$validator.fields.find({ name: 'f5' });

  expect(wrapper.vm.$validator.errors.has('f5')).toBe(false);
  expect(wrapper.vm.$validator.flags.f5.valid).toBe(true);
});

test('custom components targeting via $refs', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    d1: '10'
  });
  wrapper.find(InputComponent).trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.first('f7')).toBe('The f7 confirmation does not match.');
  wrapper.setData({
    d2: '10'
  });
  wrapper.findAll(InputComponent).at(1).trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.has('f7')).toBe(false);
  expect(wrapper.vm.$validator.flags.f7.valid).toBe(true);
});

test('fails silently if it cannot find the target field', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  const input = wrapper.find('#f9');
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.fields.find({ name: 'f9' }).dependencies.length).toBe(0);
});

test('catches invalid selectors', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  const input = wrapper.find('#f11');
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.fields.find({ name: 'f11' }).dependencies.length).toBe(0);
});