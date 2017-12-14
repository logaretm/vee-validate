import { mount, shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import BasicComponent from './components/Basic';
import InjectComponent from './components/Inject';
import ChildInject from './components/stubs/ChildWithParentValidatorInjection';
import ChildNew from './components/stubs/ChildWithNewValidatorInjection';

test('bind: warns if no validator instance was found in the directive context', () => {
  global.console.warn = jest.fn();
  const Vue = createLocalVue();
  Vue.directive('validate', VeeValidate.directive);
  const wrapper = shallow(BasicComponent, { localVue: Vue });
  expect(global.console.warn).toHaveBeenCalled();
});

test('unbind: does not detach the field if it does not exist', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = shallow(BasicComponent, { localVue: Vue });
  const validator = wrapper.vm.$validator;
  const detach = validator.detach.bind(validator);
  validator.detach = jest.fn(detach);
  validator.fields.items[0].id = 'jadja'; // mess up the id.
  wrapper.destroy();
  expect(validator.detach).not.toHaveBeenCalled();
});

test('destroy: the validator instance is destroyed when the owning component is destroyed', () => {
  VeeValidate.uninstall();
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount(InjectComponent, { localVue: Vue });
  const childWithParentValidator = wrapper.find(ChildInject);
  const childWithNewValidator = wrapper.find(ChildNew);

  const validator = wrapper.vm.$validator;
  const destroy = validator.destroy.bind(validator);
  validator.destroy = jest.fn(destroy);

  childWithParentValidator.destroy();
  expect(validator.destroy).not.toHaveBeenCalled();
  wrapper.destroy();
  expect(validator.destroy).toHaveBeenCalled();
});
