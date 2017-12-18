import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Aliases';

const Vue = createLocalVue();
Vue.use(VeeValidate);
VeeValidate.Validator.localize('en', {
  messages: {
    confirmed: (field, [targetName]) => `The ${field} and ${targetName} do not match`
  },
  attributes: {
    confirm: 'Password Confirmation'
  }
});

test('validates input initially when .initial modifier is set', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  wrapper.setData({
    password: '',
    confirm: ''
  });
  await flushPromises();

  expect(wrapper.vm.errors.first('password')).toBe('The Password field is required.');
  expect(wrapper.vm.errors.first('confirm')).toBe('The Password Confirmation field is required.');

  wrapper.setData({
    password: '12345'
  });
  await flushPromises();
  expect(wrapper.vm.errors.first('password')).toBe('The Password and Password Confirmation do not match');
});
