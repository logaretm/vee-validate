import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import I18n from 'vue-i18n';
import VeeValidate from '@/index';

const Vue = createLocalVue();

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

Vue.use(I18n);
const i18n = new I18n({
  locale: 'en',
  messages: {
    en: {
      validation: {
        attributes: {
          name: 'Full Name'
        }
      }
    }
  }
});

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    en: {
      messages: {
        required: 'This is required',
        alpha: name => `The ${name} field must be alpha`
      }
    }
  }
});

test('fetches error messages from i18n messages', async () => {
  const wrapper = mount({
    i18n,
    data: () => ({
      value: '12'
    }),
    template: `
      <ValidationProvider rules="required">
        <div slot-scope="{ errors }">
          <input v-model="value" type="text">
          <p>{{ errors[0] }}</p>
        </div>
      </ValidationProvider>
    `
  }, { localVue: Vue });

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();

  expect(wrapper.find('p').text()).toBe('This is required');
});

test('fetches field names from i18n', async () => {
  const wrapper = mount({
    i18n,
    data: () => ({
      value: ''
    }),
    template: `
      <ValidationProvider rules="alpha" name="name">
        <div slot-scope="{ errors }">
          <input v-model="value" type="text">
          <p>{{ errors[0] }}</p>
        </div>
      </ValidationProvider>
    `
  }, { localVue: Vue });

  const input = wrapper.find('input');
  input.setValue('12');
  await flushPromises();

  expect(wrapper.find('p').text()).toContain('Full Name');
});
