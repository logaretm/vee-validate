import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { ValidationProvider, ValidationObserver, extend, withValidation, configure } from '@/index.full';
import InputWithoutValidation from './components/Input';
import InputWithSlot from './components/InputWithSlot';
import ModelComp from './../helpers/ModelComp';
import { template } from '@babel/core';

const Vue = createLocalVue();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

const DEFAULT_REQUIRED_MESSAGE = 'The {field} field is required';

test('renders its tag attribute', () => {
  const wrapper = mount(
    {
      data: () => ({ val: '' }),
      template: `
        <ValidationProvider v-slot="ctx">
          <input v-model="val" type="text">
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  expect(wrapper.html()).toBe(`<span><input type="text"></span>`);
});

test('can be renderless with slim prop', () => {
  const wrapper = mount(
    {
      data: () => ({ val: '' }),
      template: `
        <ValidationProvider v-slot="ctx" slim>
          <input v-model="val" type="text">
        </ValidationProvider>
      `
    },
    { localVue: Vue }
  );

  expect(wrapper.html()).toBe(`<input type="text">`);
});

test('listens for input, blur events to set flags', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required" v-slot="{ errors, ...rest }">
          <input v-model="value" type="text">
          <li v-for="(flag, name) in rest" v-if="flag" :id="name">{{ name }}</li>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  expect(wrapper).toHaveElement('#untouched');
  expect(wrapper).toHaveElement('#pristine');
  input.trigger('blur');
  await flushPromises();
  expect(wrapper).toHaveElement('#touched');
  expect(wrapper).not.toHaveElement('#untouched');
  expect(wrapper).toHaveElement('#pristine');
  await flushPromises();
  input.trigger('input');
  await flushPromises();
  expect(wrapper).not.toHaveElement('#pristine');
  expect(wrapper).toHaveElement('#dirty');
});

test.each([
  [5, 10, true],
  [5, 5, false],
  ['my value', 'new value', true],
  ['my value', 'my value', false],
  [['apple', 'orange', 'banana'], ['lemon', 'orange', 'strawberry'], true],
  [['apple', 'orange', 'banana'], ['apple', 'orange', 'banana'], false],
  [{ fruit: 'apple', vegetable: 'peas' }, { fruit: 'lemon', vegetable: 'carrot' }, true],
  [{ fruit: 'apple', vegetable: 'peas' }, { fruit: 'apple', vegetable: 'peas' }, false]
])('listens for input, blur events to set "changed" flag', async (initialValue, newValue, expectedFlag) => {
  const wrapper = mount(
    {
      data: () => ({
        value: initialValue
      }),
      components: {
        CustomInput: {
          name: 'CustomInput',
          props: ['value'],
          template: `
        <p id="input">{{ value }}</p>
      `
        }
      },
      template: `
      <ValidationProvider rules="required" v-slot="{ changed }">
      <CustomInput v-model="value"/>
      <span id="changed">{{ changed }}</span>
      </ValidationProvider>
    `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.findComponent({ name: 'CustomInput' });
  const changedSpan = wrapper.find('#changed');
  input.vm.$emit('blur');
  await flushPromises();
  input.vm.$emit('input', newValue);
  await flushPromises();
  expect(changedSpan.text()).toContain(expectedFlag);
});

test('validates lazy models', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required" v-slot="{ errors }">
          <input v-model.lazy="value" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

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

test('uses appropriate events for different input types', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required" v-slot="{ errors }">
            <select v-model="value">
              <option value="">0</option>
              <option value="1">1</option>
            </select>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

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
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider :immediate="true" rules="required" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const error = wrapper.find('#error');

  // flush the pending validation.
  await flushPromises();

  expect(error.text()).toContain(DEFAULT_REQUIRED_MESSAGE);
});

test('validates on rule change if the field was validated before', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: '',
        rules: { required: true }
      }),
      template: `
        <div>
          <ValidationProvider :rules="rules" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('#error');
  input.setValue('1');
  // flush the pending validation.
  await flushPromises();

  expect(error.text()).toBe('');

  wrapper.vm.rules = {
    required: false,
    min: 3
  };

  await flushPromises();
  expect(error.text()).toBe('The {field} field must be at least 3 characters');
});

test('validates on rule change: testing arrays', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: '',
        rules: { required: true, oneOf: [1, 2, 3] }
      }),
      template: `
        <div>
          <ValidationProvider :rules="rules" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('#error');
  input.setValue('4');
  // flush the pending validation.
  await flushPromises();

  expect(error.text()).toBe('The {field} field is not a valid value');

  wrapper.vm.rules = {
    required: true,
    oneOf: [1, 2, 3, 4]
  };

  await flushPromises();
  expect(error.text()).toBe('');
});

test('validates on rule change: testing regex', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: '',
        rules: { required: true, regex: /[0-9]+/i }
      }),
      template: `
        <div>
          <ValidationProvider :rules="rules" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('#error');
  input.setValue('88');
  // flush the pending validation.
  await flushPromises();

  expect(error.text()).toBe('');

  wrapper.vm.rules = {
    required: false,
    regex: /^[0-9]$/i
  };

  await flushPromises();
  expect(error.text()).toBe('The {field} field format is invalid');
});

test('validates on rule change: testing NaN', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: '',
        rules: { required: true, max: NaN }
      }),
      template: `
        <div>
          <ValidationProvider :rules="rules" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('#error');
  input.setValue('2');
  // flush the pending validation.
  await flushPromises();

  expect(error.text()).toBe('The {field} field may not be greater than NaN characters');

  wrapper.vm.rules = {
    required: true,
    max: NaN
  };

  await flushPromises();
  expect(error.text()).toBe('The {field} field may not be greater than NaN characters');
});

test('validates components on input by default', async () => {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
  const wrapper = mount(
    {
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
          <ValidationProvider rules="required" v-slot="{ errors }">
            <TextInput v-model="value" ref="input"></TextInput>
            <span id="error">{{ errors && errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false, attachTo: '#root' }
  );

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
  const wrapper = mount(
    {
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
          <ValidationProvider rules="required" v-slot="{ errors }">
            <TextInput v-model="value" ref="input"></TextInput>
            <span ref="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const error = wrapper.findComponent({ ref: 'error' });
  const input = wrapper.findComponent({ ref: 'input' });

  expect(error.text()).toBe('');
  input.vm.$emit('change', '');
  await flushPromises();
  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

  input.vm.$emit('change', 'txt');
  await flushPromises();
  expect(error.text()).toBe('');
});

test('validates target dependant fields using targeted params', async () => {
  const wrapper = mount(
    {
      data: () => ({
        password: '',
        confirmation: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required" vid="confirmation" v-slot="ctx">
            <input type="password" v-model="confirmation">
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:confirmation" v-slot="{ errors }">
            <input type="password" v-model="password">
            <span id="err1">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

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

  inputs.at(0).setValue('val1');
  await flushPromises();
  expect(error.text()).toBeTruthy();
});

test('validates target dependant fields using interpolated params', async () => {
  const wrapper = mount(
    {
      data: () => ({
        password: '',
        confirmation: ''
      }),
      template: `
        <div>
          <ValidationProvider rules="required" vid="confirmation" v-slot="ctx">
            <input type="password" v-model="confirmation">
          </ValidationProvider>
          <ValidationProvider rules="required|is:@confirmation" v-slot="{ errors }">
            <input type="password" v-model="password">
            <span id="err1">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

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

  inputs.at(0).setValue('val1');
  await flushPromises();
  expect(error.text()).toBeTruthy();
});

test('validates file input', async () => {
  const wrapper = mount(
    {
      data: () => ({
        file: null
      }),
      template: `
        <ValidationProvider rules="required|image" v-slot="{ errors, validate }">
          <input type="file"  @change="validate">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.trigger('change');
  await flushPromises();

  const error = wrapper.find('#error');
  expect(error.text()).toBeTruthy();
});

test('removes the provider reference at destroy', () => {
  const wrapper = mount(
    {
      template: `
        <div>
          <ValidationProvider vid="named" ref="provider" v-slot="{ errors }">
            <span></span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const providersMap = wrapper.vm.$_veeObserver.refs;
  expect(providersMap.named).toBe(wrapper.vm.$refs.provider);
  wrapper.destroy();
  expect(providersMap.named).toBeUndefined();
});

test('creates HOCs from other components', async () => {
  const InputWithValidation = withValidation(InputWithoutValidation);

  const wrapper = mount(
    {
      template: `
        <div>
          <InputWithValidation v-model="value" rules="required"></InputWithValidation>
        </div>
      `,
      data: () => ({ value: '' }),
      components: {
        InputWithValidation
      }
    },
    { localVue: Vue, sync: false }
  );

  const error = wrapper.find('#error');
  const input = wrapper.find('#input');

  expect(error.text()).toBe('');
  input.setValue('');
  await flushPromises();

  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  input.setValue('txt');
  await flushPromises();
  expect(error.text()).toBe('');
});

test('created HOCs preserves their slots', async () => {
  const InputWithValidation = withValidation(InputWithSlot);

  const wrapper = mount(
    {
      template: `
        <div>
          <InputWithValidation v-model="value" rules="required" v-slot="{ data }">
            <p id="slotted">{{ data }}</p>
          </InputWithValidation>
        </div>
      `,
      data: () => ({ value: '' }),
      components: {
        InputWithValidation
      }
    },
    { localVue: Vue, sync: false }
  );

  const slot = wrapper.find('#slotted');
  expect(slot.exists()).toBe(true);
  expect(slot.text()).toBe('10');
});

test('resets validation state', async () => {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
  const wrapper = mount(
    {
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
          <ValidationProvider rules="required" ref="provider" v-slot="{ errors, failedRules }">
            <TextInput v-model="value" ref="input"></TextInput>
            <span id="error">{{ errors && errors[0] }}</span>
            <span id="failed">{{ failedRules.required }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false, attachTo: '#root' }
  );

  const error = wrapper.find('#error');
  const input = wrapper.find('#input');

  expect(error.text()).toBe('');
  expect(wrapper.find('#failed').text()).toBe('');

  input.setValue('');
  await flushPromises();

  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
  expect(wrapper.find('#failed').text()).toBe(DEFAULT_REQUIRED_MESSAGE);

  wrapper.vm.$refs.provider.reset();
  await flushPromises();
  expect(error.text()).toBe('');
  expect(wrapper.find('#failed').text()).toBe('');
});

test('setting bails prop to false disables fast exit', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider :bails="false" rules="email|min:3" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p v-for="error in errors">{{ error }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.setValue('1');
  await flushPromises();

  const errors = wrapper.findAll('p');
  expect(errors).toHaveLength(2);
  expect(errors.at(0).text()).toBe('The {field} field must be a valid email');
  expect(errors.at(1).text()).toBe('The {field} field must be at least 3 characters');
});

test('setting bails and skipIfEmpty to false runs all rules', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider :skipIfEmpty="false" :bails="false" rules="email|min:3" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p v-for="error in errors">{{ error }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();

  const errors = wrapper.findAll('p');
  expect(errors).toHaveLength(2);
  expect(errors.at(0).text()).toBe('The {field} field must be a valid email');
  expect(errors.at(1).text()).toBe('The {field} field must be at least 3 characters');
});

test('setting skipIfEmpty to false runs only the first rule', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider :skipIfEmpty="false" rules="email|min:3" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p v-for="error in errors">{{ error }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();

  const errors = wrapper.findAll('p');
  expect(errors).toHaveLength(1);
  expect(errors.at(0).text()).toBe('The {field} field must be a valid email');
});

test('setting detectInput to false disables the v-model autodetection', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider :detectInput="false" rules="required" v-slot="{ errors }">
          <input id="input" v-model="value" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('#input');
  input.setValue('');
  await flushPromises();

  const error = wrapper.find('#error');
  expect(error.text()).toBeFalsy();
});

const sleep = wait => new Promise(resolve => setTimeout(resolve, wait));
test('validation can be debounced', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required" :debounce="50" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p>{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('p');

  input.setValue('');
  await sleep(40);
  expect(error.text()).toBe('');
  await sleep(10);
  await flushPromises();
  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
});

test('reset ignores pending validation result', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider ref="provider" rules="required" :debounce="50" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p>{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  const error = wrapper.find('p');

  input.setValue('');
  await sleep(40);
  await flushPromises();
  wrapper.vm.$refs.provider.reset();
  await flushPromises();
  expect(error.text()).toBe('');
  await sleep(10);
  await flushPromises();
  expect(error.text()).toBe('');
});

test('avoids race conditions between successive validations', async () => {
  // A decreasing timeout (the most recent validation will finish before new ones).
  extend('longRunning', {
    message: (_, __, data) => data,
    validate: value => {
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

  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required|longRunning" :debounce="10" v-slot="{ errors }">
          <input v-model="value" type="text">
          <p>{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

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
  const wrapper = mount(
    {
      template: `
        <ValidationProvider rules="required" v-slot="{ validate, errors }">
          <input type="text" @input="validate">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();

  const error = wrapper.find('#error');
  expect(error.text()).toBeTruthy();

  input.setValue('123');
  await flushPromises();

  expect(error.text()).toBeFalsy();
});

test('validates manually with a initial value using the validate event handler on native comp', async () => {
  const wrapper = mount(
    {
      data: () => ({
        myValue: 'initial value'
      }),
      template: `
        <ValidationObserver ref="obs">
          <ValidationProvider rules="required" v-slot="{ validate, errors }">
            <input type="text" :value="myValue" @input="validate">
            <p id="error">{{ errors[0] }}</p>
          </ValidationProvider>
        </ValidationObserver>
      `
    },
    { localVue: Vue, sync: false }
  );

  await wrapper.vm.$refs.obs.validate();

  const error = wrapper.find('#error');
  expect(error.text()).toBe('');
});

test('validates manually with a initial value using the validate event handler on vue comp', async () => {
  Vue.component('ModelComp', ModelComp);
  const wrapper = mount(
    {
      data: () => ({
        myValue: 'initial value'
      }),
      template: `
        <ValidationObserver ref="obs">
          <ValidationProvider rules="required" v-slot="{ validate, errors }">
            <ModelComp :value="myValue" @input="validate" />
            <p id="error">{{ errors[0] }}</p>
          </ValidationProvider>
        </ValidationObserver>
      `
    },
    { localVue: Vue, sync: false }
  );

  await wrapper.vm.$refs.obs.validate();

  const error = wrapper.find('#error');
  expect(error.text()).toBe('');
});

test('resets validation state using reset method in slot scope data', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <ValidationProvider rules="required" v-slot="{ errors, reset }">
          <input type="text" v-model="value">
          <span id="error">{{ errors && errors[0] }}</span>
          <button @click="reset">Reset</button>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

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

test('classes can be arrays', async () => {
  configure({
    classes: {
      invalid: ['wrong', 'bad'],
      valid: ['jolly', 'good']
    }
  });
  const wrapper = mount(
    {
      data: () => ({ val: '' }),
      template: `
        <ValidationProvider v-slot="{ errors, classes }">
          <input type="text" v-model="val" required :class="classes">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const input = wrapper.find('input');
  input.setValue('');
  await flushPromises();
  expect(input.classes()).toContain('wrong');
  expect(input.classes()).toContain('bad');

  input.setValue('1');
  await flushPromises();
  expect(input.classes()).toContain('jolly');
  expect(input.classes()).toContain('good');
});

test('sets errors manually with setErrors', async () => {
  const wrapper = mount(
    {
      data: () => ({ val: '1' }),
      template: `
        <ValidationProvider ref="provider" v-slot="{ errors }" rules="required">
          <input type="text" v-model="val">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  await flushPromises();
  expect(wrapper.find('#error').text()).toBe('');

  wrapper.vm.$refs.provider.setErrors(['WRONG!']);
  await flushPromises();
  expect(wrapper.find('#error').text()).toBe('WRONG!');
});

describe('HTML5 Rule inference', () => {
  test('Required and email rules', async () => {
    const wrapper = mount(
      {
        data: () => ({ val: '1' }),
        template: `
        <ValidationProvider v-slot="{ errors }">
          <input type="email" required v-model="val">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    await flushPromises();
    expect(wrapper.find('#error').text()).toBe('');
    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('is required');

    // test inferred email value
    wrapper.find('input').setValue('123');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('email');
  });

  test('Required explicit false', async () => {
    const wrapper = mount(
      {
        data: () => ({ val: '1' }),
        template: `
        <ValidationProvider v-slot="{ errors }">
          <input type="text" :required="false" v-model="val">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>`
      },
      { localVue: Vue, sync: false }
    );

    await flushPromises();
    expect(wrapper.find('#error').text()).toBe('');
    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('#error').text()).toBe('');
  });

  test('regex and minlength and maxlength rules', async () => {
    const wrapper = mount(
      {
        data: () => ({ val: '1' }),
        template: `
        <ValidationProvider v-slot="{ errors }">
          <input type="text" pattern="[0-9]+" minlength="2" maxlength="3" v-model="val">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    wrapper.find('input').setValue('a');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('format is invalid');

    // test inferred maxlength
    wrapper.find('input').setValue('1234');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('greater than 3');

    // test inferred minlength
    wrapper.find('input').setValue('1');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('least 2');
  });

  test('number and min_value and max_value', async () => {
    const wrapper = mount(
      {
        data: () => ({ val: '1' }),
        template: `
        <ValidationProvider v-slot="{ errors }">
          <input type="number" min="2" max="4" v-model="val">
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    // test min_value
    wrapper.find('input').setValue('1');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('must be 2');

    // test max_value
    wrapper.find('input').setValue('5');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('must be 4');
  });

  test('select input required', async () => {
    const wrapper = mount(
      {
        data: () => ({ val: '1' }),
        template: `
        <ValidationProvider v-slot="{ errors }">
          <select required v-model="val">
            <option value="">1</option>
            <option value="1">1</option>
          </select>
          <p id="error">{{ errors[0] }}</p>
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    wrapper.find('select').setValue('');
    await flushPromises();
    expect(wrapper.find('#error').text()).toContain('is required');
  });
});

test('field name can be resolved from name attribute', async () => {
  const wrapper = mount(
    {
      data: () => ({ val: '123' }),
      template: `
        <ValidationProvider v-slot="{ errors }" rules="required">
          <input v-model="val" name="firstName" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );
  await flushPromises();
  wrapper.find('input').setValue('');
  await flushPromises();

  expect(wrapper.find('#error').text()).toBe(DEFAULT_REQUIRED_MESSAGE.replace('{field}', 'firstName'));
});

test('field name can be resolved from id attribute', async () => {
  const wrapper = mount(
    {
      data: () => ({ val: '123' }),
      template: `
        <ValidationProvider v-slot="{ errors }" rules="required">
          <input v-model="val" id="firstName" type="text">
          <span id="error">{{ errors[0] }}</span>
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );
  await flushPromises();
  wrapper.find('input').setValue('');
  await flushPromises();

  expect(wrapper.find('#error').text()).toBe(DEFAULT_REQUIRED_MESSAGE.replace('{field}', 'firstName'));
});

test('array param collecting in the last parameter', async () => {
  extend('isOneOf', {
    validate(value, { val, isOneOf }) {
      return isOneOf.includes(value) && isOneOf.includes(val);
    },
    params: ['val', 'isOneOf'],
    message: 'nah'
  });

  const wrapper = mount(
    {
      data: () => ({ val: '1' }),
      template: `
      <ValidationProvider rules="required|isOneOf:2,1,2" v-slot="{ errors }">
        <input type="text" v-model="val">
        <p id="error">{{ errors[0] }}</p>
      </ValidationProvider>
    `
    },
    { localVue: Vue, sync: false }
  );

  wrapper.find('input').setValue('5');
  await flushPromises();
  expect(wrapper.find('#error').text()).toContain('nah');
  wrapper.find('input').setValue('1');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBe('');
});

test('should throw if rule does not exist', async () => {
  const wrapper = mount(
    {
      data: () => ({ val: '123' }),
      template: `
        <ValidationProvider rules="wutface" v-slot="ctx" ref="pro">
          <input v-model="val" type="text">
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );
  await expect(wrapper.vm.$refs.pro.validate()).rejects.toThrow();
});

test('returns custom error messages passed in the customMessages prop', async () => {
  extend('truthy', {
    validate: Boolean,
    message: 'Original Message'
  });

  const customMessage = 'Custom Message';

  const wrapper = mount(
    {
      data: () => ({ val: false }),
      template: `
        <ValidationProvider rules="truthy" :customMessages="{ truthy: '${customMessage}' }" v-slot="ctx" ref="pro">
          <input v-model="val" type="text">
        </ValidationProvider>
      `
    },
    { localVue: Vue, sync: false }
  );

  const result = await wrapper.vm.$refs.pro.validate();

  expect(result.errors[0]).toEqual(customMessage);
});

describe('Handle value mutating modifiers', () => {
  test('handles .number modifier', () => {
    const wrapper = mount(
      {
        data: () => ({ val: '' }),
        template: `
        <ValidationProvider rules="required" v-slot="ctx" ref="provider">
          <input v-model.number="val" type="text">
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    // should happen synchronously!
    wrapper.find('input').setValue('11');
    expect(wrapper.vm.$refs.provider.value).toBe(11);

    // NaN values are left as is.
    wrapper.find('input').setValue('x23');
    expect(wrapper.vm.$refs.provider.value).toBe('x23');
  });

  test('handles .trim modifier', () => {
    const wrapper = mount(
      {
        data: () => ({ val: '' }),
        template: `
        <ValidationProvider rules="required" v-slot="ctx" ref="provider">
          <input v-model.trim="val" type="text">
        </ValidationProvider>
      `
      },
      { localVue: Vue, sync: false }
    );

    // should happen synchronously!
    wrapper.find('input').setValue('  abc');
    expect(wrapper.vm.$refs.provider.value).toBe('abc');
  });
});
