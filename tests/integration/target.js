import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import InputComponent from './components/stubs/Input';
import TestComponent from './components/Targets';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('native HTML elements targeting', async () => {
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

test('custom components targeting', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    d1: '10'
  });
  wrapper.findAll(InputComponent).at(0).trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.first('f5')).toBe('The f5 confirmation does not match.');
  wrapper.setData({
    d2: '10'
  });
  wrapper.findAll(InputComponent).at(1).trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.has('f5')).toBe(false);
  expect(wrapper.vm.$validator.flags.f5.valid).toBe(true);
});

// tests #1107
test('refs with v-for loops', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    d3: '10'
  });
  wrapper.findAll(InputComponent).at(2).trigger('input');
  await flushPromises();


  expect(wrapper.vm.$validator.errors.first('f7_1')).toBe('The f7_1 confirmation does not match.');
  expect(wrapper.vm.$validator.errors.first('f7_2')).toBe('The f7_2 confirmation does not match.');
  expect(wrapper.vm.$validator.errors.first('f7_3')).toBe('The f7_3 confirmation does not match.');

  wrapper.setData({
    d4: '10'
  });
  wrapper.findAll(InputComponent).at(3).trigger('input');
  wrapper.findAll(InputComponent).at(5).trigger('input');
  wrapper.findAll(InputComponent).at(7).trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.errors.has('f7_1')).toBe(false);
  expect(wrapper.vm.$validator.flags.f7_1.valid).toBe(true);
  expect(wrapper.vm.$validator.errors.has('f7_2')).toBe(false);
  expect(wrapper.vm.$validator.flags.f7_2.valid).toBe(true);
  expect(wrapper.vm.$validator.errors.has('f7_3')).toBe(false);
  expect(wrapper.vm.$validator.flags.f7_3.valid).toBe(true);
});


test('fails silently if it cannot find the target field', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  const input = wrapper.find('#f3');
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.$validator.fields.find({ name: 'f3' }).dependencies.length).toBe(0);
});
