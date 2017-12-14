import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Model';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('watches input value on model change', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });
  expect(wrapper.vm.errors.count()).toBe(0);
  wrapper.setData({ value: '' });
  await flushPromises();
  expect(wrapper.vm.errors.has('field')).toBe(true);
});

test('model can be watched via the directive arg', async() => {
  const wrapper = shallow(TestComponent, { localVue: Vue });
  expect(wrapper.vm.errors.has('argField')).toBe(false);
  wrapper.setData({ input: '' });
  await flushPromises();
  expect(wrapper.vm.errors.has('argField')).toBe(true);
});



test('falls back to DOM events if the model is unwatchable', async() => {
  const wrapper = shallow(TestComponent, { localVue: Vue });
  expect(wrapper.vm.errors.count()).toBe(0);
  wrapper.setData({
    form: {
      value: ''
    }
  });

  await flushPromises();
  expect(wrapper.vm.errors.has('unwatchablefield')).toBe(false);
  wrapper.find('#unwatchable').trigger('input');
  await flushPromises();
  expect(wrapper.vm.errors.has('unwatchablefield')).toBe(true);
});

