import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import flushPromises from 'flush-promises';
import InputWithoutValidation from './components/Input';
import SelectWithoutValidation from './components/Select';

const Vue = createLocalVue();
Vue.use(VeeValidate, { inject: false });
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

const DEFAULT_REQUIRED_MESSAGE = 'The {field} field is required.';

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

  test('validates lazy models', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required">
            <template slot-scope="{ errors }">
              <input v-model.lazy="value" type="text">
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const input = wrapper.find('input');
    const error = wrapper.find('#error');

    input.element.value = '';
    input.trigger('input');
    await flushPromises();
    // did not validate on input.
    expect(error.text()).toBe('');

    input.trigger('change');
    await flushPromises();
    // validation triggered on change.
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.element.value = 'text';
    input.trigger('change');
    await flushPromises();
    // validation triggered on change.
    expect(error.text()).toBe('');
  });

  test('uses appropiate events for different input types', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required">
            <template slot-scope="{ errors }">
              <select v-model="value">
                <option value="">0</option>
                <option value="1">1</option>
              </select>
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const select = wrapper.find('select');
    const error = wrapper.find('#error');

    select.trigger('input');
    await flushPromises();
    // did not validate on input.
    expect(error.text()).toBe('');

    select.trigger('change');
    select.element.value = '';
    await flushPromises();
    // validation triggered on change.
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    select.element.value = '1';
    wrapper.find('select').trigger('change');
    await flushPromises();

    expect(error.text()).toBe('');
  });

  test('validates fields initially using the immediate prop', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider :immediate="true" rules="required">
            <template slot-scope="{ errors }">
              <input v-model="value" type="text">
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');

    // flush the pending validation.
    await flushPromises();

    expect(error.text()).toContain(DEFAULT_REQUIRED_MESSAGE);
  });

  test('validates components on input by default', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `
            <div>
              <input id="input" :value="value" @input="$emit('input', $event.target.value)">
            </div>
          `
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required">
            <template slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors && errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, attachToDocument: true, sync: false });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');

    input.element.value = '';
    input.trigger('input');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.element.value = 'val';
    input.trigger('input');
    await flushPromises();
    expect(error.text()).toBe('');
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
          <ValidationProvider rules="required">
            <template slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    const input = wrapper.find({ ref: 'input' });

    expect(error.text()).toBe('');
    input.vm.$emit('change', '');
    await flushPromises();
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.vm.$emit('change', 'txt');
    await flushPromises();
    expect(error.text()).toBe('');
  });

  test('validates on custom events', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `<input :value="value" @input="$emit('input', $event.target.value)" @blur="$emit('blur')">`
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required" events="blur">
            <template slot-scope="{ errors }">
              <TextInput v-model="value"></TextInput>
              <span id="error">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });
    const error = wrapper.find('#error');
    const input = wrapper.find('input');

    expect(error.text()).toBe('');
    input.element.value = '';
    input.trigger('input');
    await flushPromises();
    // did not validate.
    expect(error.text()).toBe('');
    input.trigger('blur');
    await flushPromises();
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });

  test('validates target dependant fields', async () => {
    const wrapper = mount({
      data: () => ({
        password: '',
        confirmation: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required" vid="confirmation">
            <template slot-scope="ctx">
              <input type="password" v-model="confirmation">
            </template>
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:confirmation">
            <template slot-scope="{ errors }">
              <input type="password" v-model="password">
              <span id="err1">{{ errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#err1');

    expect(error.text()).toBeFalsy();
    wrapper.setData({
      password: '',
      confirmation: 'val'
    });
    await flushPromises();
    expect(error.text()).toBeTruthy();
    wrapper.setData({
      password: 'val'
    });
    await flushPromises();
    expect(error.text()).toBeFalsy();
  });

  test('removes the provider reference at destroy', () => {
    const wrapper = mount({
      template: `
        <div>
          <ValidationProvider vid="named" ref="provider">
            <template slot-scope="ctx">
              <span></span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue });

    const providersMap = wrapper.vm.$_veeObserver.refs;
    expect(providersMap.named).toBe(wrapper.vm.$refs.provider);
    wrapper.destroy();
    expect(providersMap.named).toBeUndefined();
  });

  test('creates HOCs from other components', async () => {
    const InputWithValidation = VeeValidate.withValidation(InputWithoutValidation);

    const wrapper = mount({
      template: `
        <div>
          <InputWithValidation v-model="value" rules="required"></InputWithValidation>
        </div>
      `,
      data: () => ({ value: '' }),
      components: {
        InputWithValidation
      }
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');
    input.element.value = '';
    input.trigger('input');

    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.element.value = 'txt';
    input.trigger('input');
    await flushPromises();
    await flushPromises();
    expect(error.text()).toBe('');
  });

  test('renders slots', async () => {
    const WithValidation = VeeValidate.withValidation(SelectWithoutValidation);
    const wrapper = mount({
      data: () => ({ value: '' }),
      template: `
        <div>
          <SelectWithValidation v-model="value" rules="required">
            <option value="">0</option>
            <option value="1">1</option>
          </SelectWithValidation>
        </div>
      `,
      components: {
        SelectWithValidation: WithValidation
      }
    }, { localVue: Vue });

    expect(wrapper.html()).toBe(`<div><div><select><option value="">0</option> <option value="1">1</option></select> <span id="error"></span></div></div>`);
  });

  test('resets validation state', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `
            <div>
              <input id="input" :value="value" @input="$emit('input', $event.target.value)">
            </div>
          `
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required" ref="provider">
            <template slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors && errors[0] }}</span>
            </template>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, attachToDocument: true, sync: false });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');

    input.element.value = '';
    input.trigger('input');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    wrapper.vm.$refs.provider.reset();
    await flushPromises();
    expect(error.text()).toBe('');
  });
});

describe('Validation Observer Component', () => {
  test('renders the tag prop', () => {
    const wrapper = mount({
      template: `
        <ValidationObserver></ValidationObserver>
      `
    }, { localVue: Vue });

    expect(wrapper.html()).toBe(`<span></span>`);
  });

  test('observes the current state of providers', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver>
          <template slot-scope="{ valid }">
            <ValidationProvider rules="required">
              <template slot-scope="ctx">
                <input v-model="value" type="text">
              </template>
            </ValidationProvider>

            <span id="state">{{ valid }}</span>
          </template>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const stateSpan = wrapper.find('#state');
    const input = wrapper.find('input');

    await flushPromises();
    expect(stateSpan.text()).toBe('false');

    input.element.value = 'value';
    input.trigger('input');
    await flushPromises();

    expect(stateSpan.text()).toBe('true');
  });

  test('triggers validation manually on its children providers', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <template slot-scope="ctx">

            <ValidationProvider rules="required">

              <template slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </template>

            </ValidationProvider>

          </template>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    await wrapper.vm.$refs.obs.validate();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });

  test('removes child ref when the child is destroyed', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <template slot-scope="ctx">

            <ValidationProvider rules="required" vid="id">

              <template slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </template>

            </ValidationProvider>

          </template>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const obs = wrapper.vm.$refs.obs;
    expect(obs.refs).toHaveProperty('id');

    wrapper.destroy();

    expect(obs.refs).not.toHaveProperty('id');
  });

  test('resets child refs', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <template slot-scope="ctx">

            <ValidationProvider rules="required">

              <template slot-scope="{ errors }">
                <input v-model="value" type="text">
                <span id="error">{{ errors[0] }}</span>
              </template>

            </ValidationProvider>

          </template>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    const error = wrapper.find('#error');
    await flushPromises();
    expect(error.text()).toBe('');

    await wrapper.vm.$refs.obs.validate();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    wrapper.vm.$refs.obs.reset();
    await flushPromises();

    expect(error.text()).toBe('');
  });

  test('collects errors from child providers', async () => {
    const wrapper = mount({
      data: () => ({
        email: '',
        name: ''
      }),
      template: `
        <ValidationObserver ref="obs">
          <template slot-scope="{ errors }">
            <ValidationProvider vid="name" rules="required">
              <template slot-scope="ctx">
                <input v-model="name" type="text">
              </template>
            </ValidationProvider>
            <ValidationProvider vid="email" rules="required">
              <template slot-scope="ctx">
                <input v-model="email" type="text">
              </template>
            </ValidationProvider>

            <p v-for="fieldErrors in errors">{{ fieldErrors[0] }}</p>
          </template>
        </ValidationObserver>
      `
    }, { localVue: Vue });

    await flushPromises();

    await wrapper.vm.$refs.obs.validate();

    const errors = wrapper.findAll('p');
    expect(errors).toHaveLength(2); // 2 fields.
    expect(errors.at(0).text()).toBe(DEFAULT_REQUIRED_MESSAGE);
    expect(errors.at(1).text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });
});
