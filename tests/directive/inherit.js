import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate, { mapValidationState } from '@/index';
import flushPromises from 'flush-promises';

test('Validation State can be shared between parent/child', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount({
    components: {
      Child: {
        computed: {
          ...mapValidationState('vstate', { inherit: true })
        },
        template: `
            <div id="error">{{ vstate.for('name').errors[0] }}</div>
          `
      }
    },
    template: `
        <div>
          <input type="text" name="name" v-validate="'required'">
          <Child />
        </div>
      `,
    computed: {
      ...mapValidationState('vee')
    }
  }, { localVue: Vue, sync: false });

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBe('The name field is required.');
});
