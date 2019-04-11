import { mount, createLocalVue } from '@vue/test-utils';
import { renderToString } from '@vue/server-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import InputWithoutValidation from './components/Input';
import SelectWithoutValidation from './components/Select';

const Vue = createLocalVue();
Vue.use(VeeValidate, { inject: false });
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

const DEFAULT_REQUIRED_MESSAGE = 'The {field} field is required.';

describe('Validation Provider Component', () => {
  test('renders its tag attribute', () => {
    const wrapper = mount({
      data: () => ({ val: '' }),
      template: `
        <ValidationProvider v-slot="ctx">
          <input v-model="val" type="text">
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    expect(wrapper.html()).toBe(`<span><input type="text"></span>`);
  });

  test('SSR: render single root slot', () => {
    const output = renderToString({
      template: `
        <ValidationProvider>
          <p slot-scope="ctx"></p>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    expect(output).toBe('<span data-server-rendered="true"><p></p></span>');
  });

  test('validates lazy models', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required">
          <div slot-scope="{ errors }">
            <input v-model.lazy="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

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
            <div slot-scope="{ errors }">
              <select v-model="value">
                <option value="">0</option>
                <option value="1">1</option>
              </select>
              <span id="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

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
            <div slot-scope="{ errors }">
              <input v-model="value" type="text">
              <span id="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

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
            <div slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors && errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false, attachToDocument: true });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');

    input.setValue('');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.setValue('val');
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
            <div slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

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

  test('uses interaction modes', async () => {
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
          <ValidationProvider rules="required" mode="lazy">
            <div slot-scope="{ errors }">
              <TextInput v-model="value"></TextInput>
              <span id="error">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });
    const error = wrapper.find('#error');
    const input = wrapper.find('input');

    expect(error.text()).toBe('');
    input.setValue('');
    await flushPromises();
    // did not validate.
    expect(error.text()).toBe('');
    input.trigger('change');
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
            <div slot-scope="ctx">
              <input type="password" v-model="confirmation">
            </div>
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:confirmation">
            <div slot-scope="{ errors }">
              <input type="password" v-model="password">
              <span id="err1">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('#err1');
    const inputs = wrapper.findAll('input');

    expect(error.text()).toBeFalsy();
    inputs.at(0).setValue('val');
    await flushPromises();
    // the password input hasn't changed yet.
    expect(error.text()).toBeFalsy();
    inputs.at(1).setValue('12');
    await flushPromises();
    // the password input was interacted with and should be validated.
    expect(error.text()).toBeTruthy();

    inputs.at(1).setValue('val');
    await flushPromises();
    // the password input now matches the confirmation.
    expect(error.text()).toBeFalsy();
  });

  test('removes the provider reference at destroy', () => {
    const wrapper = mount({
      template: `
        <div>
          <ValidationProvider vid="named" ref="provider">
            <div slot-scope="ctx">
              <span></span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

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
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');
    input.setValue('');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
    input.setValue('txt');
    await flushPromises();
    await flushPromises();
    expect(error.text()).toBe('');
  });

  test('renders slots', async () => {
    const WithValidation = VeeValidate.withValidation(SelectWithoutValidation);
    const wrapper = mount({
      data: () => ({ value: '' }),
      template: `
        <SelectWithValidation v-model="value" rules="required">
          <option value="">0</option>
          <option value="1">1</option>
        </SelectWithValidation>
      `,
      components: {
        SelectWithValidation: WithValidation
      }
    }, { localVue: Vue, sync: false });

    expect(wrapper.html()).toBe(`<div value=""><select><option value="">0</option> <option value="1">1</option></select> <span id="error"></span></div>`);
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
            <div slot-scope="{ errors }">
              <TextInput v-model="value" ref="input"></TextInput>
              <span id="error">{{ errors && errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false, attachToDocument: true });

    const error = wrapper.find('#error');
    const input = wrapper.find('#input');

    expect(error.text()).toBe('');

    input.setValue('');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    wrapper.vm.$refs.provider.reset();
    await flushPromises();
    expect(error.text()).toBe('');
  });

  test('setting bails prop to false disables fast exit', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider :bails="false" rules="email|min:3">
          <div slot-scope="{ errors }">
            <input v-model="value" type="text">
            <p v-for="error in errors">{{ error }}</p>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    input.setValue('');
    await flushPromises();

    const errors = wrapper.findAll('p');
    expect(errors).toHaveLength(2);
    expect(errors.at(0).text()).toBe('The {field} field must be a valid email.');
    expect(errors.at(1).text()).toBe('The {field} field must be at least 3 characters.');
  });

  const sleep = (wait) => new Promise(resolve => setTimeout(resolve, wait));
  test('validation can be debounced', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required" :debounce="50">
          <div slot-scope="{ errors }">
            <input v-model="value" type="text">
            <p>{{ errors[0] }}</p>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    const error = wrapper.find('p');

    input.setValue('');
    await sleep(40);
    expect(error.text()).toBe('');
    await sleep(10);
    await flushPromises();
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });

  test('avoids race conditions between successive validations', async () => {
    // A decreasing timeout (the most recent validation will finish before new ones).
    VeeValidate.Validator.extend('longRunning', {
      getMessage: (_, __, data) => data,
      validate: (value) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              valid: value === 42,
              data: 'Lost in time'
            });
          }, 20);
        });
      }
    });

    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required|longRunning" :debounce="10">
          <div slot-scope="{ errors }">
            <input v-model="value" type="text">
            <p>{{ errors[0] }}</p>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    const error = wrapper.find('p');

    input.setValue('123');
    input.setValue('12');
    input.setValue('');
    await sleep(100);
    await flushPromises();
    // LAST message should be the required one.
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  });

  test('validates manually using the validate event handler', async () => {
    const wrapper = mount({
      template: `
        <ValidationProvider rules="required">
          <div slot-scope="{ validate, errors }">
            <input type="text" @input="validate">
            <p id="error">{{ errors[0] }}</p>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    input.setValue('');
    await flushPromises();

    const error = wrapper.find('#error');
    expect(error.text()).toBeTruthy();

    input.setValue('123');
    await flushPromises();

    expect(error.text()).toBeFalsy();
  });

  test('resets validation state using reset method in slot scope data', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required">
            <div slot-scope="{ errors, reset }">
              <input type="text" v-model="value">
              <span id="error">{{ errors && errors[0] }}</span>
              <button @click="reset">Reset</button>
            </div>
          </ValidationProvider>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('#error');
    const input = wrapper.find('input');

    expect(error.text()).toBe('');

    input.setValue('');
    await flushPromises();

    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(error.text()).toBe('');
  });

  test('resolves rules based on the HTML input attributes', async () => {
    const wrapper = mount({
      data: () => ({ val: '' }),
      template: `
        <ValidationProvider>
          <div slot-scope="{ errors }">
            <input type="text" v-model="val" required minlength="3">
            <p id="error">{{ errors[0] }}</p>
          </div>
        </ValidationProvider>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    input.setValue('');
    await flushPromises();

    const error = wrapper.find('#error');
    expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

    input.setValue('12');
    await flushPromises();
    expect(error.text()).toBe('The {field} field must be at least 3 characters.');

    input.setValue('123');
    await flushPromises();
    expect(error.text()).toBeFalsy();
  });
});
