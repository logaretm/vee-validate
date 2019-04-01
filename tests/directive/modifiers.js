import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, mapValidationActions } from '@/index';

describe('directive modifiers', () => {
  test('.bails modifier', async () => {
    const Vue = createLocalVue();
    // test if it overrides the fastExit global setting.
    Vue.use(VeeValidate, { fastExit: false });

    const wrapper = mount({
      computed: mapValidationState('vee'),
      methods: mapValidationActions(['validate']),
      template: `
      <div>
        <input type="text" name="bails" v-validate.bails="'required|min:3|is:3'">
        <p v-for="error in vee.for('bails').errors">{{ error }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await wrapper.vm.validate();
    await flushPromises();

    expect(wrapper.findAll('p')).toHaveLength(1);
  });

  test('.continues modifier', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      methods: mapValidationActions(['validate']),
      template: `
      <div>
        <input type="text" name="bails" v-validate.continues="'required|min:3|is:3'">
        <p v-for="error in vee.for('bails').errors">{{ error }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await wrapper.vm.validate();
    await flushPromises();

    expect(wrapper.findAll('p')).toHaveLength(3);
  });

  test('.immediate modifier', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="text" name="field" v-validate.immediate="'required'">
        <p>{{ vee.for('field').errors[0] }}</p>
      </div>
    `
    }, { localVue: Vue, sync: false });

    await flushPromises();
    expect(wrapper.find('p').text()).toBe('The field field is required.');
  });

  test('.persist modifier', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      data: () => ({
        isHidden: false
      }),
      template: `
      <div>
        <div v-if="!isHidden">
          <input type="text" name="__field__" v-validate.persist="'required'" ref="vid">
          <p>{{ vee.for('__field__').errors[0] }}</p>
        </div>
      </div>
    `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('p').text()).toBeTruthy();

    wrapper.setData({
      isHidden: true
    });

    expect(wrapper.find('input').exists()).toBe(true);
    await flushPromises();
    wrapper.setData({
      isHidden: false
    });
    await flushPromises();
    expect(wrapper.find('input').exists()).toBe(true);

    expect(wrapper.find('p').text()).toBeTruthy();
  });
});
