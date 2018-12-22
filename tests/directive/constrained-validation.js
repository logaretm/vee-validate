import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import flushPromises from 'flush-promises';

describe('HTML Constrained Validation API', () => {
  test('sets HTML contstrained validation API messages', async () => {
    const Vue = createLocalVue();

    Vue.use(VeeValidate, {
      validity: true
    });
    const wrapper = mount({
      template: `<input type="text" name="email" v-validate="'email'">`
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    input.element.setCustomValidity = jest.fn();
    input.setValue('not an email');
    await flushPromises();
    expect(input.element.setCustomValidity).toHaveBeenCalledTimes(1);
    expect(input.element.setCustomValidity).toHaveBeenLastCalledWith(
      wrapper.vm.$validator.errors.first('email')
    );
  });
});
