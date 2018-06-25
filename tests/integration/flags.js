import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/Flags';

test('flags are reactive', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });
  const input = wrapper.find('#name');
  let error = wrapper.find('#error');
  expect(error.element).toBeFalsy();

  input.trigger('input');
  await flushPromises();
  error = wrapper.find('#error');

  expect(error.element).toBeTruthy();
});

test('field flags', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });
  const input = wrapper.find('input');
  const field = wrapper.vm.$validator.fields.find({ name: 'name' });
  // wait for the silent validation to finish.
  await flushPromises();

  expect(field.flags).toEqual({
    required: true,
    valid: false,
    invalid: true,
    untouched: true,
    touched: false,
    pristine: true,
    dirty: false,
    pending: false,
    validated: false,
    changed: false
  });

  input.trigger('input');
  input.trigger('blur');

  await flushPromises();
  expect(field.flags).toEqual({
    required: true,
    valid: false,
    invalid: true,
    untouched: false,
    touched: true,
    pristine: false,
    dirty: true,
    pending: false,
    validated: true,
    changed: false
  });

  input.element.value = '123';
  input.trigger('input');
  input.trigger('blur');
  await flushPromises();

  expect(field.flags).toEqual({
    required: true,
    valid: true,
    invalid: false,
    untouched: false,
    touched: true,
    pristine: false,
    dirty: true,
    pending: false,
    validated: true,
    changed: true
  });

  field.reset();
  expect(field.flags).toEqual({
    required: true,
    valid: null,
    invalid: null,
    untouched: true,
    touched: false,
    pristine: true,
    dirty: false,
    pending: false,
    validated: false,
    changed: false
  });
});

test('adds listeners when field flag is manually set', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });
  const input = wrapper.find('input');
  const field = wrapper.vm.$validator.fields.find({ name: 'name' });

  expect(field.flags.touched).toBe(false);
  input.trigger('blur');
  await flushPromises();
  expect(field.flags.touched).toBe(true);

  field.setFlags({
    untouched: true
  });
  expect(field.flags.touched).toBe(false);

  // test if the listener was added again after resetting the touched flag.
  input.trigger('blur');
  await flushPromises();
  expect(field.flags.touched).toBe(true);
});

test('scoped field flags', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = shallow(TestComponent, { localVue: Vue });
  wrapper.vm.$validator.fields.find({ name: 'scoped', scope: 's1' });
  // wait for the silent validation to finish.
  await flushPromises();

  expect(wrapper.vm.fields.$s1.scoped).toEqual({
    required: true,
    valid: false,
    invalid: true,
    untouched: true,
    touched: false,
    pristine: true,
    dirty: false,
    pending: false,
    validated: false,
    changed: false
  });
});
