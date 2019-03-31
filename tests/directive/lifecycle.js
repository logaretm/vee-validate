import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('life-cycle hooks', () => {
  test('update: validates if the field rules change', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="text" name="name" v-validate="rules">
        <span>{{ vee.for('name').errors[0] }}</span>
      </div>
    `,
      data: () => ({ rules: 'min:3' })
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    const error = wrapper.find('span');
    input.setValue('12');
    await flushPromises();

    expect(error.text()).toBe('The name field must be at least 3 characters.');
    wrapper.setData({
      rules: 'email'
    });

    await flushPromises();

    expect(error.text()).toBe('The name field must be a valid email.');
  });
});
