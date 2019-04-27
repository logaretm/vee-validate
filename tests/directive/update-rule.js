import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, Validator } from '@/index';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('Rules can be updated', async () => {
  const wrapper = mount({
    data: () => ({
      value: ''
    }),
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input type="text" v-model="value" name="field" v-validate="'required|testRule'">
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `
  }, { localVue: Vue, sync: false });

  Validator.extend('testRule', () => {
    return false;
  });

  const error = wrapper.find('span');
  const input = wrapper.find('input');

  expect(error.text()).toBeFalsy();
  input.setValue('1');
  await flushPromises();
  expect(error.text()).not.toBe('hello there');

  Validator.extend('testRule', {
    message: 'hello there'
  });

  input.setValue('2');
  await flushPromises();
  expect(error.text()).toBe('hello there');
});
