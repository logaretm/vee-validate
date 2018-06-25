import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/Basic';
import CustomEventTestComponent from './components/Events';

test('can customize validation trigger events via global config', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, {
    events: 'blur|custom'
  });

  const wrapper = shallow(TestComponent, { localVue: Vue });

  const input = wrapper.find('input');
  expect(wrapper.vm.errors.count()).toBe(0);
  input.trigger('input');
  await flushPromises();
  expect(wrapper.vm.errors.count()).toBe(0); // no validation triggered

  input.trigger('blur');
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(1);
  wrapper.vm.errors.clear();
  expect(wrapper.vm.errors.count()).toBe(0);

  input.trigger('custom');
  await flushPromises();
  expect(wrapper.vm.errors.count()).toBe(1);
});

test('can customize events per field via data-vv-validate-on attribute', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(CustomEventTestComponent, { localVue: Vue });

  const input = wrapper.find('input');
  expect(wrapper.vm.errors.count()).toBe(0);
  input.trigger('input');
  await flushPromises();
  expect(wrapper.vm.errors.count()).toBe(0); // no validation triggered

  input.trigger('custom');
  await flushPromises();
  expect(wrapper.vm.errors.count()).toBe(1);
});
