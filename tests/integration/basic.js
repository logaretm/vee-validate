import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Basic';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('watches input value on input and blur', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  const input = wrapper.find('input');
  expect(wrapper.vm.errors.count()).toBe(0);
  input.trigger('input');
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(1);
});
