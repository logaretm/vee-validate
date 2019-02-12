import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/Persist';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('persist fields should stay in the field list, as well as their errors', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  await flushPromises();

  // await new Promise(resolve => wrapper.vm.$nextTick(() => resolve()));
  expect(wrapper.vm.errors.count()).toBe(2);
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(4);

  wrapper.vm.displayFields = false; // We hide all the fields
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(1); // Only one persist field is errored (because one is immediate)
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(2); // We expect the persist fields to be there

  wrapper.vm.displayFields = true;
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(2);
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(4); // The four fields are visible

  expect(await wrapper.vm.$validator.validateAll()).toBe(false); // 4 required -> 4 errors

  expect(wrapper.vm.errors.count()).toBe(4); // The .validateAll call has triggered 4 errors
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(4);

  wrapper.vm.displayFields = false;
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(2); // The two persist fields are still errored
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(2);

  wrapper.vm.displayFields = true;
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(3); // The two persist fields are still errored
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(4);

  // The `valid` flag must stay the same as before
  expect(wrapper.vm.fields['field-persist'].valid).toBe(false);

  // One of the ways to remove the field is to set the persist prop to false
  wrapper.vm.$validator.fields.find({ name: 'field-persist' }).persist = false;
  wrapper.vm.displayFields = false;
  await flushPromises();

  expect(wrapper.vm.errors.count()).toBe(1);
  expect(Object.keys(wrapper.vm.fields)).toHaveLength(1);
});
