import { mount, shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

describe('HTML Inputs Validation', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  test('text fields', async () => {
    const wrapper = mount({
      template: `
      <div>
        <input type="text" name="input" v-validate="'required'">
        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, sync: false });
    const input = wrapper.find('input');
    const error = wrapper.find('span');

    expect(error.text()).toBeFalsy();

    input.trigger('input');
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('radio buttons fields', async () => {
    const wrapper = mount({
      template: `
      <div>
        <input type="radio" value="" id="rd1" name="input" v-validate="'required'">
        <input type="radio" value="1" id="rd2" name="input">

        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, attachToDocument: true, sync: false });
    const rd1 = wrapper.find('#rd1');
    const error = wrapper.find('span');

    rd1.setChecked();
    await flushPromises();
    expect(error.text()).toBeTruthy();

    // we need to set the element attribute
    const rd2 = wrapper.find('#rd2');
    rd2.setChecked();
    await Vue.nextTick();
    await flushPromises();

    expect(error.text()).toBeFalsy();
  });

  test('checkbox fields', async () => {
    const wrapper = shallow({
      template: `
      <div>
        <input type="checkbox" value="1" id="cb1" name="input" v-validate="'required'">
        <input type="checkbox" value="2" id="cb2" name="input">

        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, attachToDocument: true, sync: false });
    const inputs = wrapper.findAll('input');
    const error = wrapper.find('span');

    inputs.at(0).setChecked();
    await flushPromises();

    expect(error.text()).toBeFalsy();

    inputs.at(0).setChecked(false);
    await flushPromises();

    expect(error.text()).toBeTruthy();
  });

  test('select fields', async () => {
    const wrapper = mount({
      template: `
      <div>
        <select v-validate="'required'" name="input">
          <option value="" selected></option>
          <option value="1"></option>
        </select>
        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, sync: false });
    const input = wrapper.find('select');
    const error = wrapper.find('span');

    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeTruthy();

    input.element.value = '1';
    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeFalsy();
  });

  test('select multiple fields', async () => {
    const wrapper = mount({
      template: `
      <div>
        <select v-validate="'required'" name="input" multiple>
          <option value="1"></option>
          <option value="2"></option>
        </select>
        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, sync: false });
    const input = wrapper.find('select');
    const error = wrapper.find('span');

    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeTruthy();

    Array.from(input.element.options).forEach(option => {
      option.selected = true;
    });

    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeFalsy();
  });

  test('file fields', async () => {
    const wrapper = mount({
      template: `
      <div>
        <input type="file" value="" name="input" v-validate="'required'">
        <span>{{ errors.first('input') }}</span>
      </div>
    `
    }, { localVue: Vue, sync: false });
    const input = wrapper.find('input');
    const error = wrapper.find('span');

    input.trigger('change');
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });
});
