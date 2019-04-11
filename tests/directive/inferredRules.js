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
