import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/BailContinue';

test('fields can be configured to continue after first failure with the .continues modifier', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });

  await wrapper.vm.$validator.validate();
  await flushPromises();

  expect(wrapper.vm.errors.collect('continues')).toHaveLength(3);
  expect(wrapper.vm.errors.collect('undefined')).toHaveLength(1); // unconfigured field follows the global fastExit = true
});

test('fields can be configured to bail if the fastExit is disabled with the .bails modifier', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, { fastExit: false });

  const wrapper = shallow(TestComponent, { localVue: Vue });

  await wrapper.vm.$validator.validate();
  await flushPromises();

  expect(wrapper.vm.errors.collect('bails')).toHaveLength(1);
  expect(wrapper.vm.errors.collect('undefined')).toHaveLength(3); // unconfigured field follows the global fastExit = false which still acts like .continues modifier.
});

test('continues modifier can be used to skip the required rule empty value check', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });

  await wrapper.vm.$validator.validate();
  await flushPromises();

  expect(wrapper.vm.errors.collect('notRequired')).toHaveLength(2); // is and min should fail.
});
