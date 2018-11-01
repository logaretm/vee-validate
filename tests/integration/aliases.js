import { shallow, createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
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

test('validates input initially when .immediate modifier is set', async () => {
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

test('alias can be set with the ctor options', async () => {
  const wrapper = mount({
    template: `<TextInput v-model="value" v-validate="'required'" name="bar" label="foo"></TextInput>`,
    data: () => ({
      value: ''
    }),
    components: {
      TextInput: {
        template: `<input type="text">`,
        $_veeValidate: {
          name () {
            return this.$attrs.name;
          },
          alias () {
            return this.$attrs.label;
          }
        }
      }
    }
  }, { localVue: Vue });

  await wrapper.vm.$validator.validate();

  expect(wrapper.vm.errors.first('bar')).toBe('The foo field is required.');
});
