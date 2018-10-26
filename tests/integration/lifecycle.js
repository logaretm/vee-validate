import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import BasicComponent from './components/Basic';

test('bind: warns if no validator instance was found in the directive context', () => {
  global.console.warn = jest.fn();
  const Vue = createLocalVue();
  Vue.directive('validate', VeeValidate.directive);
  mount(BasicComponent, { localVue: Vue });
  expect(global.console.warn).toHaveBeenCalled();
});

test('unbind: does not detach the field if it does not exist', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount(BasicComponent, { localVue: Vue });
  const validator = wrapper.vm.$validator;
  const detach = validator.detach.bind(validator);
  validator.detach = jest.fn(detach);
  validator.fields.items[0].id = 'jadja'; // mess up the id.
  wrapper.destroy();
  expect(validator.detach).not.toHaveBeenCalled();
});

test('destroy: removes vm associated errors when the vm is destroyed', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount(BasicComponent, { localVue: Vue });
  const input = wrapper.find('input');
  input.value = '';
  await wrapper.vm.$validator.validate();
  const validator = wrapper.vm.$validator;

  expect(validator.errors.count()).toBe(1);
  wrapper.destroy();
  expect(validator.errors.count()).toBe(0); // should be removed.
});
