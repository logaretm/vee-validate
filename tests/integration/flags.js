import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Flags';

test('provides fake flags proxy to prevent render errors', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });
  const input = wrapper.find('#name');
  let error = wrapper.find('#error');
  expect(error.element).toBeFalsy();

  input.trigger('input');
  await flushPromises();
  error = wrapper.find('#error');

  expect(error.element).toBeTruthy();
});
