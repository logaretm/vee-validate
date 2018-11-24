import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

describe('Field Selectors', () => {
  test('error selections by field id', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate="'required'" name="field">
        <p id="error" v-show="errors.has('#1')">{{ errors.first('#1') }}</p>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();

    // test scope update
    expect(wrapper.find('#error').text()).toBe('The field field is required.');
  });

  test('error filtering by selecting a specific rule using firstByRule', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate.continues="'required|min:3'" name="field">
        <p id="error">{{ errors.firstByRule('field', 'min') }}</p>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();

    // test scope update
    expect(wrapper.find('#error').text()).toBe('The field field must be at least 3 characters.');
  });

  test('display first failing rule name', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate="'required'" name="field">
        <p id="error">{{ errors.firstRule('field') }}</p>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();

    // test scope update
    expect(wrapper.find('#error').text()).toBe('required');
  });

  test('error filtering by excluding a rule using firstNot', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate.continues="'required|min:3'" name="field">
        <p id="error">{{ errors.firstNot('field', 'required') }}</p>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();

    // test scope update
    expect(wrapper.find('#error').text()).toBe('The field field must be at least 3 characters.');
  });

  test('collects multiple errors for a field', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate.continues="'required|min:3'" name="field">
        <ul id="errors">
          <li v-for="error in errors.collect('field')">{{ error }}</li>
        </ul>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();
    const errors = wrapper.find('#errors');
    expect(errors.element.children).toHaveLength(2);
  });

  test('collects multiple errors for multiple fields', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      template: `
      <div>
        <input type="text" v-validate.immediate.continues="'required|min:3'" name="field1">
        <input type="text" v-validate.immediate.continues="'required|min:3'" name="field2">
        <ul id="errors">
          <li v-for="errorList in errors.collect()">
            <ul>
              <li v-for="error in errorList">{{ error }}</li>
            </ul>
          </li>
        </ul>
      </div>
    `
    }, { localVue: Vue });

    await flushPromises();
    const errors = wrapper.find('#errors');
    Array.from(errors.element.children).every(child => {
      expect(child.children[0].children).toHaveLength(2);
    });
  });
});
