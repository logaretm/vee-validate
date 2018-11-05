import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('validates if the field rules change', async () => {
  const wrapper = mount({
    template: `
      <div>
        <input type="text" name="name" v-validate="rules">
        <span>{{ errors.first('name') }}</span>
      </div>
    `,
    data: () => ({ rules: 'required' })
  }, { localVue: Vue });

  const input = wrapper.find('input');
  const error = wrapper.find('span');
  input.trigger('input');
  await flushPromises();

  expect(error.text()).toBe('The name field is required.');
  input.element.value = '11';
  wrapper.setData({
    rules: 'email'
  });

  await flushPromises();
  expect(error.text()).toBe('The name field must be a valid email.');
});

test('does not modify the DOM rendering', () => {
  const component = {
    template: `<input type="text" name="field" v-validate="'required'">`
  };

  const first = mount(component, { localVue: Vue });
  const second = mount(component, { localVue: Vue });

  // same component, should match in UI and in rendered HTML.
  expect(first.html()).toBe(second.html());
});

describe('lifecycle hooks', () => {
  const BasicComponent = {
    template: `<input type="text" name="field" v-validate="'required'">`
  };

  test('bind: warns if no validator instance was found in the directive context', () => {
    global.console.warn = jest.fn();
    const Vue = createLocalVue();
    Vue.directive('validate', VeeValidate.directive);
    mount(BasicComponent, { localVue: Vue });
    expect(global.console.warn).toHaveBeenCalled();
  });

  test('unbind: does not detach the field if it does not exist', () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);
    const wrapper = mount(BasicComponent, { localVue: Vue });
    const validator = wrapper.vm.$validator;
    const detach = validator.detach.bind(validator);
    validator.detach = jest.fn(detach);
    validator.fields[0].id = 'jadja'; // mess up the id.
    wrapper.destroy();
    expect(validator.detach).not.toHaveBeenCalled();
  });

  test('destroy: removes vm associated errors when the vm is destroyed', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);
    const wrapper = mount(BasicComponent, { localVue: Vue });
    const input = wrapper.find('input');
    input.value = '';
    await wrapper.vm.$validator.validate();
    const validator = wrapper.vm.$validator;

    expect(validator.errors.count()).toBe(1);
    wrapper.destroy();
    expect(validator.errors.count()).toBe(0); // should be removed.
  });
});
