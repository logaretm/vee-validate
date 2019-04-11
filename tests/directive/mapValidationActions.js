import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, mapValidationActions } from '@/index';

test('can validate and reset fields', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    computed: mapValidationState('vee'),
    methods: mapValidationActions(['reset', 'validate']),
    template: `
      <div>
        <input type="text" name="__field__" v-validate="'required'">
        <p>{{ vee.for('__field__').errors[0] }}</p>
      </div>
    `
  }, { localVue: Vue, sync: false });

  await wrapper.vm.validate();
  await flushPromises();
  expect(wrapper.find('p').text()).toBeTruthy();
  wrapper.vm.reset();
  await flushPromises();
  expect(wrapper.find('p').text()).toBeFalsy();
});

test('validate returns true by default', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    methods: mapValidationActions(['reset', 'validate']),
    template: `
      <div>
      </div>
    `
  }, { localVue: Vue, sync: false });

  expect(await wrapper.vm.validate()).toBe(true);
  wrapper.vm.reset();
});

test('actions can be renamed via object', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    computed: mapValidationState('vee'),
    methods: mapValidationActions({
      checkForm: 'validate',
      reloadForm: 'reset'
    }),
    template: `
      <div>
        <input type="text" name="__field__" v-validate="'required'">
        <p>{{ vee.for('__field__').errors[0] }}</p>
      </div>
    `
  }, { localVue: Vue, sync: false });

  await wrapper.vm.checkForm();
  await flushPromises();
  expect(wrapper.find('p').text()).toBeTruthy();
  wrapper.vm.reloadForm();
  await flushPromises();
  expect(wrapper.find('p').text()).toBeFalsy();
});
