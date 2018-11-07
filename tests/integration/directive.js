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

describe('v-model integration', () => {
  test('watches input value on model change', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <input type="text" v-model="value" name="field" v-validate="'required'">
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('span');

    expect(error.text()).toBeFalsy();
    wrapper.setData({ value: '' });
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('watches input value on lazy model change', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      template: `
        <div>
          <input type="text" v-model.lazy="value" name="field" v-validate="'required'">
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('span');

    expect(error.text()).toBeFalsy();
    wrapper.setData({ value: '' });
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('model can be watched via the directive arg', async () => {
    const wrapper = mount({
      data: () => ({
        input: ''
      }),
      template: `
        <div>
          <input type="text" name="field" v-validate:input="'required'">
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('span');
    expect(error.text()).toBeFalsy();
    wrapper.setData({ input: '' });
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('falls back to DOM events if the model is unwatchable', async () => {
    const wrapper = mount({
      data: () => ({
        input: { value: '' }
      }),
      template: `
        <div>
          <input type="text" name="field" v-model="input['field']" v-validate="'required'">
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('span');
    expect(wrapper.vm.errors.count()).toBe(0);
    wrapper.setData({
      input: {
        value: ''
      }
    });

    await flushPromises();
    expect(error.text()).toBeFalsy();
    wrapper.find('input').trigger('input');
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('detects the model config on the component ctor options', async () => {
    const wrapper = mount({
      components: {
        Child: {
          props: ['name', 'value'],
          template: `<input type="text" :value="value" @change="$emit('change', $event.target.value)">`,
          model: {
            event: 'change'
          }
        }
      },
      data: () => ({ input: '' }),
      template: `
        <div>
          <child ref="child" type="text" name="field" v-model="input" v-validate="'required'"></child>
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const input = wrapper.find({ ref: 'child' });
    const error = wrapper.find('span');

    await flushPromises();
    expect(error.text()).toBeFalsy();

    input.vm.$emit('change', '');
    await flushPromises();

    expect(error.text()).toBeTruthy();
  });

  test('watches the model from the child context if it cannot be watched from the parent', async () => {
    const wrapper = mount({
      components: {
        InputField: {
          props: ['name', 'value'],
          template: `<input type="text" :value="value" @change="$emit('change', $event.target.value)">`,
          model: {
            event: 'change'
          }
        }
      },
      data: () => ({ input: { value: '12' } }),
      template: `
        <div>
          <input-field type="text" name="field" v-model="input['value']" v-validate="'required'"></input-field>
          <span>{{ errors.first('field') }}</span>
        </div>
      `
    }, { localVue: Vue });

    const error = wrapper.find('span');

    await flushPromises();
    expect(error.text()).toBeFalsy();

    wrapper.setData({
      input: {
        value: ''
      }
    });

    await flushPromises();
    expect(error.text()).toBeTruthy();
  });
});

describe('Field name resolution', () => {
  test('resolves field name from name attribute on HTML inputs', async () => {
    const wrapper = mount({
      template: `
        <div>
          <input type="text" name="__fieldName__" v-validate="'required'">
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue });

    wrapper.find('input').trigger('input');

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves field name from data-vv-name attribute on HTML inputs', async () => {
    const wrapper = mount({
      template: `
        <div>
          <input type="text" data-vv-name="__fieldName__" v-validate="'required'">
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue });

    wrapper.find('input').trigger('input');

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves component field names from data-vv-name attr', async () => {
    const wrapper = mount({
      data: () => ({ value: '123' }),
      components: {
        Child: {
          template: '<div></div>'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" data-vv-name="__fieldName__" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue });

    wrapper.setData({
      value: ''
    });

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves component field names from name attr', async () => {
    const wrapper = mount({
      data: () => ({ value: '123' }),
      components: {
        Child: {
          props: ['name'],
          template: '<div></div>'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" name="__fieldName__" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue });

    wrapper.setData({
      value: ''
    });

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves component field names from custom name resolver', async () => {
    const wrapper = mount({
      data: () => ({ value: '123' }),
      components: {
        Child: {
          $_veeValidate: {
            name: () => '__fieldName__'
          },
          props: ['name'],
          template: '<div></div>'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue });

    wrapper.setData({
      value: ''
    });

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });
});
