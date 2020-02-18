import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { ValidationProvider, localize, extend } from '@/index.full';

const Vue = createLocalVue();
Vue.component('ValidationProvider', ValidationProvider);

test('can define new locales', async () => {
  localize('ar', {
    messages: {
      required: 'هذا الحقل مطلوب'
    }
  });

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

  expect(error.text()).toContain('هذا الحقل مطلوب');
});

test('can define specific messages for specific fields', async () => {
  localize('en', {
    fields: {
      test: {
        required: 'WRONG!'
      }
    }
  });

  const wrapper = mount(
    {
      data: () => ({
        first: '',
        second: ''
      }),
      template: `
        <div>
          <ValidationProvider name="test" :immediate="true" rules="required" v-slot="{ errors }">
            <input v-model="first" type="text">
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider :immediate="true" rules="required" v-slot="{ errors }">
            <input v-model="second" type="text">
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  await flushPromises();
  const errors = wrapper.findAll('.error');
  expect(errors).toHaveLength(2);

  expect(errors.at(0).text()).toContain('WRONG!');
  expect(errors.at(1).text()).toContain('The {field} field is required');
});

test('can merge locales without setting the current one', async () => {
  localize({
    ar: {
      messages: {
        required: 'هذا الحقل مطلوب'
      }
    }
  });

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

  // locale wasn't set.
  expect(error.text()).toContain('The {field} field is required');
});

test('falls back to the default message if rule without message exists', async () => {
  extend('i18n', () => false);

  const wrapper = mount(
    {
      data: () => ({
        value: '1'
      }),
      template: `
        <div>
          <ValidationProvider :immediate="true" rules="required|i18n" v-slot="{ errors }">
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

  expect(error.text()).toContain('{field} is not valid');
});

test('uses field name in the default message if rule without message exists', async () => {
  extend('ruleWithoutMessage', () => false);

  const wrapper = mount(
    {
      data: () => ({
        value: '1'
      }),
      template: `
        <div>
          <ValidationProvider :immediate="true" rules="required|ruleWithoutMessage" v-slot="{ errors }">
            <input name="MyFancyInputName" v-model="value" type="text">
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

  expect(error.text()).toContain('MyFancyInputName is not valid');
});

test('can define custom field names', async () => {
  localize('en', {
    names: {
      ugly: 'Name'
    }
  });

  const wrapper = mount(
    {
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <ValidationProvider name="ugly" :immediate="true" rules="required" v-slot="{ errors }">
            <input v-model="value" type="text">
            <span id="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      `
    },
    { localVue: Vue, sync: false }
  );

  const error = wrapper.find('#error');
  await flushPromises();

  expect(error.text()).toContain('The Name field is required');
});

test('regenerates error messages when locale changes', async () => {
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
  expect(error.text()).toContain('The {field} field is required');
  localize('ar');

  await flushPromises();
  expect(error.text()).toContain('هذا الحقل مطلوب');
});
