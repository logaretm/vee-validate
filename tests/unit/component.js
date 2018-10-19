import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import flushPromises from 'flush-promises';

const Vue = createLocalVue();
Vue.use(VeeValidate);
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

describe('Validation Provider Component', () => {
  test('renders a span by default', () => {
    const wrapper = mount({
      template: `
        <div>
          <ValidationProvider></ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    expect(wrapper.html()).toBe(`<div><span></span></div>`);
  });

  test('renders the root element using the tag prop', () => {
    const wrapper = mount({
      template: `
        <div>
          <ValidationProvider tag="div"></ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    expect(wrapper.html()).toBe(`<div><div></div></div>`);
  });

  test('validates fields initially using the immediate prop', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider ref="provider" :immediate="true" rules="required">
            <template slot-scope="{ errors }">
              <input v-model="value" type="text">
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    // flush the pending validation.
    await flushPromises();
    expect(wrapper.vm.$refs.provider.messages).toHaveLength(1);
    expect(wrapper.vm.$refs.provider.messages).toContain('The {field} field is required.');
    expect(wrapper.find('#error').text()).toBe('The {field} field is required.');
  });

  test('validates components on input by default', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `<input :value="value" @input="$emit('input', $event.target.value)">`
        }
      },
      template: `
        <div>
          <ValidationProvider ref="provider" rules="required">
            <template slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    expect(wrapper.vm.$refs.provider.messages).toHaveLength(0);
    wrapper.find({ ref: 'input' }).trigger('input', 'val');
    await flushPromises();
    expect(wrapper.vm.$refs.provider.messages).toHaveLength(1);
  });

  test('validates components on configured model event', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          model: {
            event: 'change'
          },
          props: ['value'],
          template: `<input :value="value" @change="$emit('change', $event.target.value)">`
        }
      },
      template: `
        <div>
          <ValidationProvider ref="provider" rules="required">
            <template slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    expect(wrapper.vm.$refs.provider.messages).toHaveLength(0);
    wrapper.find({ ref: 'input' }).trigger('change', 'val');
    await flushPromises();
    expect(wrapper.vm.$refs.provider.messages).toHaveLength(1);
  });

  test('validates target dependant fields', async () => {
    const wrapper = mount({
      data: () => ({
        password: '',
        confirmation: ''
      }),
      template: `
        <div>
          <ValidationProvider ref="confirmation" rules="required" name="confirmation">
            <template slot-scope="ctx">
              <input type="password" v-model="confirmation" ref="confirmInput">
            </template>
          </ValidationProvider>
          <ValidationProvider ref="provider" rules="required|confirmed:confirmation">
            <template slot-scope="ctx">
              <input type="password" v-model="password" ref="input">
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    expect(wrapper.vm.$refs.provider.messages).toHaveLength(0);
    wrapper.setData({
      password: '',
      confirmation: 'val'
    });
    wrapper.find({ ref: 'confirmInput' }).trigger('input', 'val');
    await flushPromises();
    expect(wrapper.vm.$refs.provider.messages).toHaveLength(1);
    wrapper.setData({
      password: 'val',
      confirmation: 'val'
    });
    wrapper.find({ ref: 'input' }).trigger('input', 'val');
    await flushPromises();
    expect(wrapper.vm.$refs.provider.messages).toHaveLength(0);
  });
});
