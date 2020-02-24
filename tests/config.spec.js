import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { ValidationProvider, configure } from '@/index.full';

const Vue = createLocalVue();
Vue.component('ValidationProvider', ValidationProvider);

test('can set config using configure fn', async () => {
  configure({
    bails: false
  });

  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider :immediate="true" rules="required|min:3" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span class="error" v-for="error in errors">{{ error }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  // flush the pending validation.
  await flushPromises();
  const errors = wrapper.findAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors.at(0).text()).toContain('The {field} field is required');
  expect(errors.at(1).text()).toContain('The {field} field must be at least 3 characters');
});
