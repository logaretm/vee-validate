import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Model';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('watches input value on model change', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  expect(wrapper.vm.errors.count()).toBe(0);
  wrapper.setData({
    value: ''
  });

  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(1);

  wrapper.setData({
    value: 'valid'
  });
});
