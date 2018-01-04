import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Basic';

const Vue = createLocalVue();

Vue.use(VeeValidate, {
  classes: true,
  classNames: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});

test('watches input value on input and blur', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  const input = wrapper.find('input');

  expect(input.hasClass('untouched')).toBe(true); // hasn't been touched
  expect(input.hasClass('touched')).toBe(false);
  expect(input.hasClass('pristine')).toBe(true); // hasn't been changed yet.
  expect(input.hasClass('dirty')).toBe(false);

  input.trigger('blur');
  await flushPromises();

  expect(input.hasClass('untouched')).toBe(false); // has been touched
  expect(input.hasClass('touched')).toBe(true);
  expect(input.hasClass('pristine')).toBe(true); // hasn't been changed yet.
  expect(input.hasClass('dirty')).toBe(false);

  expect(input.hasClass('is-valid')).toBe(false); // triggered by blur
  expect(input.hasClass('is-invalid')).toBe(true);

  input.trigger('input');
  await flushPromises();

  expect(input.hasClass('pristine')).toBe(false); // hasn't been changed yet.
  expect(input.hasClass('dirty')).toBe(true);

  expect(input.hasClass('is-valid')).toBe(false); // triggered by blur
  expect(input.hasClass('is-invalid')).toBe(true);

  input.element.value = '10';
  input.trigger('input');
  await flushPromises();

  expect(input.hasClass('is-valid')).toBe(true); // triggered by blur
  expect(input.hasClass('is-invalid')).toBe(false);
});
