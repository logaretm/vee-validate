import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

test('flags reactivity', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="name" id="name" v-validate="'required'">
        <li v-for="flag in collect(fields.name)" v-if="flag.value" :id="flag.id"></li>
      </div>
    `,
    methods: {
      collect (flags) {
        if (!flags) return [];

        return Object.keys(flags).map(f => ({ id: f, value: this.fields.name[f] }));
      }
    }
  }, { localVue: Vue });

  const input = wrapper.find('input');
  await flushPromises();

  expect(wrapper).toHaveElement('#required');
  expect(wrapper).not.toHaveElement('#valid');
  expect(wrapper).toHaveElement('#invalid');
  expect(wrapper).toHaveElement('#untouched');
  expect(wrapper).not.toHaveElement('#touched');
  expect(wrapper).toHaveElement('#pristine');
  expect(wrapper).not.toHaveElement('#dirty');
  expect(wrapper).not.toHaveElement('#pending');
  expect(wrapper).not.toHaveElement('#validated');
  expect(wrapper).not.toHaveElement('#changed');

  input.trigger('input');

  expect(wrapper).toHaveElement('#untouched');
  expect(wrapper).not.toHaveElement('#touched');
  expect(wrapper).not.toHaveElement('#pristine');
  expect(wrapper).toHaveElement('#dirty');
  expect(wrapper).toHaveElement('#validated');

  input.trigger('blur');

  expect(wrapper).not.toHaveElement('#untouched');
  expect(wrapper).toHaveElement('#touched');

  input.element.value = '123';
  input.trigger('input');

  expect(wrapper).toHaveElement('#valid');
  expect(wrapper).not.toHaveElement('#invalid');
  expect(wrapper).toHaveElement('#changed');
});

test('adds listeners when field flag is manually set', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `<input type="text" name="name" id="name" v-validate="'required'">`
  }, { localVue: Vue });

  const input = wrapper.find('input');
  const field = wrapper.vm.$validator.fields.find(f => f.matches({ name: 'name' }));

  expect(field.flags.touched).toBe(false);
  input.trigger('blur');
  await flushPromises();
  expect(field.flags.touched).toBe(true);

  field.setFlags({
    untouched: true
  });
  expect(field.flags.touched).toBe(false);

  // test if the listener was added again after resetting the touched flag.
  input.trigger('blur');
  await flushPromises();
  expect(field.flags.touched).toBe(true);
});

test('scoped field flags', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const wrapper = mount({
    template: `<input type="text" name="name" id="name" v-validate="'required'" data-vv-scope="s1">`
  }, { localVue: Vue });
  wrapper.vm.$validator.fields.find(f => f.matches({ name: 'scoped', scope: 's1' }));
  // wait for the silent validation to finish.
  await flushPromises();

  expect(wrapper.vm.fields.$s1.scoped).toEqual({
    required: true,
    valid: false,
    invalid: true,
    untouched: true,
    touched: false,
    pristine: true,
    dirty: false,
    pending: false,
    validated: false,
    changed: false
  });
});
