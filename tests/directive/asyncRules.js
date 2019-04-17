import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

test('support async rules', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  VeeValidate.Validator.extend('async', async (value) => {
    return value !== '123';
  });

  const wrapper = mount({
    data: () => ({
      value: ''
    }),
    computed: mapValidationState('vee'),
    template: `
        <div>
          <input type="text" v-model="value" name="field" v-validate="'required|async'">
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
  }, { localVue: Vue, sync: false });

  const error = wrapper.find('span');
  const input = wrapper.find('input');

  expect(error.text()).toBeFalsy();
  input.setValue('123');
  await flushPromises();
  expect(error.text()).toBe('The field value is not valid.');
  input.setValue('12');
  await flushPromises();
  expect(error.text()).toBeFalsy();
});
