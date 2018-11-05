import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

test('.bails modifier', async () => {
  const Vue = createLocalVue();
  // test if it overrides the fastExit global setting.
  Vue.use(VeeValidate, { fastExit: false });

  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="bails" v-validate.bails="'required|min:3|is:3'">
        <p v-for="error in errors.collect('bails')">{{ error }}</p>
      </div>
    `
  }, { localVue: Vue });

  await wrapper.vm.$validator.validate();
  await flushPromises();

  expect(wrapper.findAll('p')).toHaveLength(1);
});

test('.continues modifier', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="bails" v-validate.continues="'required|min:3|is:3'">
        <p v-for="error in errors.collect('bails')">{{ error }}</p>
      </div>
    `
  }, { localVue: Vue });

  await wrapper.vm.$validator.validate();
  await flushPromises();

  expect(wrapper.findAll('p')).toHaveLength(3);
});

test('.immediate modifier', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="field" v-validate.immediate="'required'">
        <p>{{ errors.first('field') }}</p>
      </div>
    `
  }, { localVue: Vue });

  await flushPromises();
  expect(wrapper.find('p').text()).toBe('The field field is required.');
});
