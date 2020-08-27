import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { ValidationProvider, ValidationObserver, setInteractionMode } from '@/index.full';

const Vue = createLocalVue();
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

const DEFAULT_REQUIRED_MESSAGE = 'The {field} field is required';

beforeEach(() => {
  setInteractionMode('aggressive');
});

test('aggressive mode', async () => {
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
          template: `<input :value="value" @input="$emit('input', $event.target.value)" @change="$emit('change', $event.target.value)" @blur="$emit('blur')">`
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required" mode="lazy" v-slot="{ errors }">
            <TextInput v-model="value"></TextInput>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false, attachTo: '#root' }
  );
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

test('passive mode', async () => {
  setInteractionMode('passive');
  const wrapper = mount(
    {
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
          <ValidationProvider rules="required" v-slot="{ errors }">
            <TextInput v-model="value"></TextInput>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );
  const error = wrapper.find('#error');
  const input = wrapper.find('input');

  expect(error.text()).toBe('');
  input.setValue('');
  await flushPromises();
  // did not validate.
  expect(error.text()).toBe('');
  input.trigger('change');
  await flushPromises();

  // did not validate.
  expect(error.text()).toBe('');

  input.trigger('blur');
  await flushPromises();
  // nothin
  expect(error.text()).toBe('');
});

test('eager mode', async () => {
  setInteractionMode('eager');
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `<input :value="value" @change="$emit('change', $event.target.value)" @input="$emit('input', $event.target.value)" @blur="$emit('blur')">`
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required|min:3" v-slot="{ errors }">
            <TextInput v-model="value"></TextInput>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );
  const error = wrapper.find('#error');
  const input = wrapper.find('input');

  expect(error.text()).toBe('');
  input.setValue('');
  await flushPromises();

  // did not validate.
  expect(error.text()).toBe('');

  input.trigger('blur');
  await flushPromises();
  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);

  input.setValue('h');
  await flushPromises();
  expect(error.text()).toBe('The {field} field must be at least 3 characters');
});

test('lazy mode', async () => {
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `<input @change="$emit('change', $event.target.value)" :value="value" @input="$emit('input', $event.target.value)" @blur="$emit('blur')">`
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required" mode="lazy" v-slot="{ errors }">
            <TextInput v-model="value"></TextInput>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );
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

test('new interaction modes can be added', async () => {
  setInteractionMode('custom', () => {
    return {
      on: ['customEvent']
    };
  });
  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          props: ['value'],
          template: `<input @customEvent="$emit('customEvent', $event.target.value)" :value="value" @input="$emit('input', $event.target.value)" @blur="$emit('blur')">`
        }
      },
      template: `
        <div>
          <ValidationProvider rules="required" v-slot="{ errors }">
            <TextInput v-model="value"></TextInput>
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );
  const error = wrapper.find('#error');
  const input = wrapper.find('input');

  expect(error.text()).toBe('');
  input.setValue('');
  await flushPromises();
  // did not validate.
  expect(error.text()).toBe('');
  input.trigger('customEvent');
  await flushPromises();
  expect(error.text()).toBe(DEFAULT_REQUIRED_MESSAGE);
});

test('throws if new mode was added without a valid factory fn', () => {
  expect(() => {
    setInteractionMode('throws', 'hello');
  }).toThrow();
});
