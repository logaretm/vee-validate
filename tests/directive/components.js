import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

test('validates custom components', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount({
    data: () => ({
      value: ''
    }),
    computed: mapValidationState('vee'),
    components: {
      ChildInput: {
        template: `<div><input type="text" @input="$emit('input', $event.target.value)"></div>`
      }
    },
    template: `
      <div>
        <ChildInput name="field" v-validate="'required'" />
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `
  }, { localVue: Vue, sync: false });

  const error = wrapper.find('span');
  const input = wrapper.find('input');

  expect(error.text()).toBeFalsy();
  input.setValue('1');
  await flushPromises();
  input.setValue('');
  await flushPromises();
  expect(error.text()).toBeTruthy();
});
