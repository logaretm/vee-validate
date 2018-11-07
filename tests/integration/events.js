import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

test('can customize validation trigger events via global config', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, {
    events: 'blur|custom'
  });

  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="field" v-validate="'required'">
        <span>{{ errors.count() }}</span>
      </div>
    `
  }, { localVue: Vue });

  const input = wrapper.find('input');
  const count = wrapper.find('span');

  expect(count.text()).toBe('0');
  input.trigger('input');
  await flushPromises();
  expect(count.text()).toBe('0');

  input.trigger('blur');
  await flushPromises();

  expect(count.text()).toBe('1');
});

test('can customize events per field via data-vv-validate-on attribute', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="field" v-validate="'required'" data-vv-as="custom">
        <span>{{ errors.count() }}</span>
      </div>
    `
  }, { localVue: Vue });

  const input = wrapper.find('input');
  const count = wrapper.find('span');

  expect(count.text()).toBe('0');
  input.trigger('input');
  await flushPromises();
  expect(count.text()).toBe('0');

  input.trigger('custom');
  await flushPromises();
  expect(count.text()).toBe('1');
});
