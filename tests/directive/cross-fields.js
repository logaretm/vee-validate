import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, mapValidationActions } from '@/index';

describe('Cross Field Validation', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  test('native HTML elements targeting', async () => {
    const localVue = createLocalVue();
    localVue.use(VeeValidate);

    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="password" name="password" v-validate="'required|confirmed:confirm'">
        <input type="password" name="confirm" v-validate="'required'" ref="confirm">
        <span id="pwError">{{ vee.for('password').errors[0] }}</span>
        <span id="confirmError">{{ vee.for('confirm').errors[0] }}</span>
      </div>
    `
    }, { localVue, sync: false });

    const input = wrapper.find('input[name="password"]');
    const confirm = wrapper.find('input[name="confirm"]');

    input.setValue('123');
    await flushPromises();

    expect(wrapper.find('#pwError').text()).toBeTruthy();

    confirm.setValue('123');

    await flushPromises();
    expect(wrapper.find('#pwError').text()).toBeFalsy();
    expect(wrapper.find('#confirmError').text()).toBeFalsy();
  });

  test('custom components targeting', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      components: {
        InputField: {
          props: ['name', 'value'],
          template: `<input type="text" :name="name" :value="value" @input="$emit('input', $event.target.value)">`,
          model: {
            event: 'input'
          }
        }
      },
      data: () => ({ password: '', confirm: '' }),
      template: `
        <div>
          <input-field name="password" v-model="password" v-validate="'required|confirmed:confirm'"></input-field>
          <input-field name="confirm" v-model="confirm" v-validate="'required'" ref="confirm"></input-field>
          <span id="pwError">{{ vee.for('password').errors[0] }}</span>
          <span id="confirmError">{{ vee.for('confirm').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input[name="password"]').setValue('12');

    await flushPromises();

    expect(wrapper.find('#pwError').text()).toBeTruthy();
    wrapper.find('input[name="confirm"]').setValue('12');

    await flushPromises();

    expect(wrapper.find('#pwError').text()).toBeFalsy();
    expect(wrapper.find('#confirmError').text()).toBeFalsy();
  });

  test('fails silently if it cannot find the target field', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input type="password" name="password" v-validate="'required|confirmed:confirm'">
        <input type="password" name="confirm" v-validate="'required'">
        <span id="pwError">{{ vee.for('password').errors[0] }}</span>
        <span id="confirmError">{{ vee.for('confirm').errors[0] }}</span>
      </div>
    `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    input.setValue('123');
    await flushPromises();

    expect(wrapper.find('#pwError').text()).toBeTruthy();
  });

  test('aliases are aware of cross field validation messages', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      methods: {
        ...mapValidationActions({ validate: 'validate' })
      },
      template: `
      <div>
        <input type="password" name="password" v-model="password" v-validate="'required|confirmed:confirm'" data-vv-as="Password">
        <input type="password" name="confirm" v-model="confirm" v-validate="'required'" ref="confirm">
        <span id="pwError">{{ vee.for('password').errors[0] }}</span>
        <span id="confirmError">{{ vee.for('confirm').errors[0] }}</span>
      </div>
    `,
      data: () => ({ password: '', confirm: '' })
    }, { localVue: Vue, sync: false });

    VeeValidate.Validator.localize('en', {
      messages: {
        confirmed: (field, _, { targetName }) => `The ${field} and ${targetName} do not match`
      },
      attributes: {
        confirm: 'Password Confirmation'
      }
    });

    wrapper.setData({
      password: '',
      confirm: ''
    });

    await wrapper.vm.validate();

    expect(wrapper.find('#pwError').text()).toBe('The Password field is required.');
    expect(wrapper.find('#confirmError').text()).toBe('The Password Confirmation field is required.');

    wrapper.setData({
      password: '12345'
    });

    await flushPromises();
    expect(wrapper.find('#pwError').text()).toBe('The Password and Password Confirmation do not match');
  });
});
