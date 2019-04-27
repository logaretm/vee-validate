import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate, { mapValidationState } from '@/index';
import flushPromises from 'flush-promises';

test('Resolves rules from the HTML attributes', async () => {
  const Vue = createLocalVue();

  Vue.use(VeeValidate);
  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `<div>
      <input type="email" name="email" v-validate required>
      <span>{{ vee.for('email').errors[0] }}</span>
    </div>`
  }, { localVue: Vue, sync: false });

  const input = wrapper.find('input');
  const error = wrapper.find('span');
  input.setValue('');
  await flushPromises();
  expect(error.text()).toBe('The email field is required.');
  input.setValue('not an email');
  await flushPromises();
  expect(error.text()).toBe('The email field must be a valid email.');
});

test('Resolves max length to max rule', async () => {
  const Vue = createLocalVue();

  Vue.use(VeeValidate);
  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `<div>
      <input type="text" name="text" v-validate maxlength="3">
      <span>{{ vee.for('text').errors[0] }}</span>
    </div>`
  }, { localVue: Vue, sync: false });

  const input = wrapper.find('input');
  const error = wrapper.find('span');
  input.setValue('hello');
  await flushPromises();
  expect(error.text()).toBe('The text field may not be greater than 3 characters.');
});

test('Resolves pattern attribute to regex rule', async () => {
  const Vue = createLocalVue();

  Vue.use(VeeValidate);
  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `<div>
      <input type="text" name="text" v-validate pattern="[0-9]">
      <span>{{ vee.for('text').errors[0] }}</span>
    </div>`
  }, { localVue: Vue, sync: false });

  const input = wrapper.find('input');
  const error = wrapper.find('span');
  input.setValue('hello');
  await flushPromises();
  expect(error.text()).toBe('The text field format is invalid.');
});

test('Resolves min and max values for number inputs', async () => {
  const Vue = createLocalVue();

  Vue.use(VeeValidate);
  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input type="number" name="number" v-validate min="3" max="5">
        <span>{{ vee.for('number').errors[0] }}</span>
      </div>`
  }, { localVue: Vue, sync: false });

  const input = wrapper.find('input');
  const error = wrapper.find('span');
  input.setValue('2');
  await flushPromises();
  expect(error.text()).toBe('The number field must be 3 or more.');
  input.setValue('6');
  await flushPromises();
  expect(error.text()).toBe('The number field must be 5 or less.');
});
