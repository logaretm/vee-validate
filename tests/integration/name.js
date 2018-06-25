import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/Names';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('resolves field name from name attribute and data-vv-name on HTML inputs', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    first: '',
    second: '',
  });

  await flushPromises();
  expect(wrapper.vm.errors.all()).toEqual([
    'The first field is required.',
    'The second field is required.'
  ]);
});

test('resolves component field names from name prop and data-vv-name', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    third: '',
    fourth: '',
  });

  await flushPromises();
  expect(wrapper.vm.errors.all()).toEqual([
    'The third field is required.',
    'The fourth field is required.'
  ]);
});

test('resolves component field names from custom name resolver', async () => {
  const wrapper = mount(TestComponent, { localVue: Vue });
  wrapper.setData({
    fifth: ''
  });

  await flushPromises();
  expect(wrapper.vm.errors.all()).toEqual([
    'The fifth field is required.'
  ]);
});
