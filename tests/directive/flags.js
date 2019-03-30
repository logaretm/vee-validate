import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('Field Flags', () => {
  test('flags reactivity', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="text" name="name" id="name" v-validate="'required'">
        <li v-for="(flag, name) in vee.for('name').flags" v-if="flag" :id="name">{{ name }}</li>
      </div>
    `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    await flushPromises();

    expect(wrapper).toHaveElement('#required');
    expect(wrapper).not.toHaveElement('#valid'); // input is undetermined yet.
    expect(wrapper).not.toHaveElement('#invalid'); // input is undetermined yet.
    expect(wrapper).toHaveElement('#untouched');
    expect(wrapper).not.toHaveElement('#touched');
    expect(wrapper).toHaveElement('#pristine');
    expect(wrapper).not.toHaveElement('#dirty');
    expect(wrapper).not.toHaveElement('#pending');
    expect(wrapper).not.toHaveElement('#validated');
    expect(wrapper).not.toHaveElement('#changed');

    input.trigger('input');
    await flushPromises();

    expect(wrapper).toHaveElement('#untouched');
    expect(wrapper).not.toHaveElement('#touched');
    expect(wrapper).not.toHaveElement('#pristine');
    expect(wrapper).toHaveElement('#dirty');
    expect(wrapper).toHaveElement('#validated');

    input.trigger('blur');
    await flushPromises();

    expect(wrapper).not.toHaveElement('#untouched');
    expect(wrapper).toHaveElement('#touched');

    input.setValue('123');
    await flushPromises();

    expect(wrapper).toHaveElement('#valid');
    expect(wrapper).not.toHaveElement('#invalid');
    expect(wrapper).toHaveElement('#changed');
  });
});
