import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

test('child components can inject provided validators', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `
      <div>
        <input name="test" v-validate.immediate="'required'">
        <child></child>
      </div>
    `,
    components: {
      Child: {
        inject: ['$validator'],
        template: `<p id="error">{{ errors.first('test') }}</p>`
      }
    }
  }, { localVue: Vue });

  expect(wrapper.find('#error').text()).toBeTruthy();
});

test('components can request a new validator instance', async () => {
  const Vue = createLocalVue();
  // disable auto injection.
  Vue.use(VeeValidate, { inject: false });

  const wrapper = mount({
    $_veeValidate: {
      validator: 'new'
    },
    template: `<p>{{ errors.count() }}</p>`
  }, { localVue: Vue });

  expect(wrapper.find('p').text()).toBe('0');
});

test('built in components should not provide a validator', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `
      <div>
        <transition name="wow">
          <input name="test" v-validate.immediate="'required'">
          <child></child>
        </transition>
      </div>
    `,
    components: {
      Child: {
        inject: ['$validator'],
        template: `<p id="error">{{ errors.first('test') }}</p>`
      }
    }
  }, { localVue: Vue });

  await flushPromises();
  expect(wrapper.find('#error').text()).toBeTruthy();
});
