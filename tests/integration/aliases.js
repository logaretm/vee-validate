import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

const localVue = createLocalVue();
localVue.use(VeeValidate);

test('aliases can be specified with data-vv-as attr', async () => {
  const wrapper = mount({
    template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate.immediate="'required'" data-vv-as="Alias">
        <span>{{ errors.first('aliasTest') }}</span>
      </div>
    `,
    data: () => ({ value: '' })
  }, { localVue });

  await flushPromises();

  expect(wrapper.find('span').text()).toBe('The Alias field is required.');
});

test('aliases can be specified with dictionary API', async () => {
  const wrapper = mount({
    template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate.immediate="'required'">
        <span>{{ errors.first('aliasTest') }}</span>
      </div>
    `,
    data: () => ({ value: '' })
  }, { localVue });

  wrapper.vm.$validator.localize({
    en: {
      attributes: {
        aliasTest: 'Alias'
      }
    }
  });

  await flushPromises();

  expect(wrapper.find('span').text()).toBe('The Alias field is required.');
});

test('aliases are aware of cross field validation messages', async () => {
  const wrapper = mount({
    template: `
      <div>
        <input type="password" name="password" v-model="password" v-validate.immediate="'required|confirmed:confirm'" data-vv-as="Password">
        <input type="password" name="confirm" v-model="confirm" v-validate.immediate="'required'">
        <span id="pwError">{{ errors.first('password') }}</span>
        <span id="confirmError">{{ errors.first('confirm') }}</span>
      </div>
    `,
    data: () => ({ password: '', confirm: '' })
  }, { localVue });

  wrapper.vm.$validator.localize('en', {
    messages: {
      confirmed: (field, [targetName]) => `The ${field} and ${targetName} do not match`
    },
    attributes: {
      confirm: 'Password Confirmation'
    }
  });

  wrapper.setData({
    password: '',
    confirm: ''
  });
  await flushPromises();

  expect(wrapper.find('#pwError').text()).toBe('The Password field is required.');
  expect(wrapper.find('#confirmError').text()).toBe('The Password Confirmation field is required.');

  wrapper.setData({
    password: '12345'
  });

  await flushPromises();
  expect(wrapper.find('#pwError').text()).toBe('The Password and Password Confirmation do not match');
});

test('aliases can be set with the ctor options', async () => {
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
  }, { localVue });

  await wrapper.vm.$validator.validate();

  expect(wrapper.vm.errors.first('bar')).toBe('The foo field is required.');
});
