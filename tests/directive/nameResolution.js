import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('Field name resolution', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  test('resolves field name from name attribute on HTML inputs', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" name="__fieldName__" v-validate="'required'">
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').trigger('input');

    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });

  test('resolves field name from data-vv-name attribute on HTML inputs', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" data-vv-name="__fieldName__" v-validate="'required'">
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
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
      computed: mapValidationState('vee'),
      components: {
        Child: {
          template: '<input @input="$emit(`input`, $event.target.value)">'
        }
      },
      template: `
        <div>
          <child ref="input" v-validate="'required'" data-vv-name="__fieldName__" v-model="value"></child>
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
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
      computed: mapValidationState('vee'),
      components: {
        Child: {
          props: ['name'],
          template: '<input @input="$emit(`input`, $event.target.value)">'
        }
      },
      template: `
        <div>
          <child v-validate="'required'" name="__fieldName__" v-model="value"></child>
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
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
      computed: mapValidationState('vee'),
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
          <span>{{ vee.for('__fieldName__').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    wrapper.find('input').setValue('');
    await flushPromises();
    expect(wrapper.find('span').text()).toContain('__fieldName__');
  });
});
