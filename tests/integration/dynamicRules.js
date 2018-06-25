import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/DynamicRules';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('automatically validates if the field rules changed and was validated before', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });
  const input = wrapper.find('input');
  input.trigger('input'); // trigger validation.
  await flushPromises(); // wait validation

  expect(wrapper.vm.$validator.errors.first('name')).toBe('The name field is required.');
  input.element.value = '11';
  wrapper.setData({
    rules: 'email'
  });
  await flushPromises(); // wait validation
  expect(wrapper.vm.$validator.errors.first('name')).toBe('The name field must be a valid email.');
});
