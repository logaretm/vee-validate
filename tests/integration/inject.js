import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import ScopedValidator from '@/core/validatorDecorator';
import TestComponent from './components/Inject';
import BuiltInsTestComponent from './components/BuiltIn';
import ChildInject from './components/stubs/ChildWithParentValidatorInjection';
import ChildNew from './components/stubs/ChildWithNewValidatorInjection';
import ChildNone from './components/stubs/Input';

test('injects parent validator instances if requested otherwise new instances will be injected', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount(TestComponent, { localVue: Vue });

  const childWithParentValidator = wrapper.find(ChildInject);
  const childWithNewValidator = wrapper.find(ChildNew);
  const childWithoutPreference = wrapper.find(ChildNone);

  // test if they all have a validator instance
  expect(childWithParentValidator.vm.$validator instanceof ScopedValidator).toBe(true);
  expect(childWithNewValidator.vm.$validator instanceof ScopedValidator).toBe(true);
  expect(childWithoutPreference.vm.$validator instanceof ScopedValidator).toBe(true);

  // without preference, a new validator should be injected.
  expect(wrapper.vm.$validator).not.toBe(childWithoutPreference.vm.$validator);
  // with new preference, it should not inherit it.
  expect(wrapper.vm.$validator).not.toBe(childWithNewValidator.vm.$validator);

  // should receive the parent instance
  expect(wrapper.vm.$validator).toBe(childWithParentValidator.vm.$validator);
});

test('does not auto inject any validator instance unless requested', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, {
    inject: false
  });

  const wrapper = mount(TestComponent, { localVue: Vue });

  const childWithParentValidator = wrapper.find(ChildInject);
  const childWithNewValidator = wrapper.find(ChildNew);
  const childWithoutPreference = wrapper.find(ChildNone);

  // test if they all have a validator instance
  expect(childWithParentValidator.vm.$validator instanceof ScopedValidator).toBe(true);
  expect(childWithNewValidator.vm.$validator instanceof ScopedValidator).toBe(true);

  // was not injected because auto inject is disbaled.
  expect(childWithoutPreference.vm.$validator).toBe(undefined);

  // with new preference, it should have a new instance.
  expect(wrapper.vm.$validator).not.toBe(childWithNewValidator.vm.$validator);

  // should receive the parent instance
  expect(wrapper.vm.$validator).toBe(childWithParentValidator.vm.$validator);
});

test('built in components should not provide a validator', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount(BuiltInsTestComponent, { localVue: Vue });
  const validator = wrapper.vm.$validator;
  const children = wrapper.findAll(ChildInject);
  for (let i = 0; i < children.length; i++) {
    expect(children.at(i).vm.$validator).toBe(validator);
  }
});
