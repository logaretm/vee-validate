import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

describe('Field name resolution', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  test('resolves field name from name attribute on HTML inputs', async () => {
    const wrapper = mount({
      template: `
        <div>
          <input type="text" name="__fieldName__" v-validate="'required'">
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

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
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves component field names from data-vv-name attr', async () => {
    const wrapper = mount({
      data: () => ({ value: '123' }),
      components: {
        Child: {
          template: '<input @input="$emit(`input`, $event.target.value)">'
        }
      },
      template: `
        <div>
          <child ref="input" v-validate="'required'" data-vv-name="__fieldName__" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves component field names from name attr', async () => {
    const wrapper = mount({
      data: () => ({ value: '123' }),
      components: {
        Child: {
          props: ['name'],
          template: '<input @input="$emit(`input`, $event.target.value)">'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" name="__fieldName__" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');
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
          template: '<input @input="$emit(`input`, $event.target.value)">'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" v-model="value"></child>
          <span>{{ errors.first('__fieldName__') }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });
});
