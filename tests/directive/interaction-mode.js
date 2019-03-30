import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('directive interaction modes', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, {
    mode: 'eager'
  });

  test('directive interaction eager mode', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" name="__fieldName__" v-validate="'required'">
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    const error = wrapper.find('span');
    await flushPromises();

    expect(error.text()).toBeFalsy();
    input.element.value = '';
    input.trigger('input');
    await flushPromises();
    expect(error.text()).toBeFalsy();

    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeTruthy();

    input.element.value = '12';
    input.trigger('input');
    await flushPromises();
    expect(error.text()).toBeFalsy();
  });
});
