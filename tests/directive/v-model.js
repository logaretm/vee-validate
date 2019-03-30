import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('v-model integration', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  test('watches input value on model change', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" v-model="value" name="field" v-validate="'required'">
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('span');
    const input = wrapper.find('input');

    expect(error.text()).toBeFalsy();
    input.setValue('1');
    await flushPromises();
    input.setValue('');
    await flushPromises();
    expect(error.text()).toBeTruthy();
  });

  test('watches input value on lazy model change', async () => {
    const wrapper = mount({
      data: () => ({
        value: ''
      }),
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" v-model.lazy="value" name="field" v-validate="'required'">
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('span');

    expect(error.text()).toBeFalsy();
    wrapper.setData({ value: '12' });
    await flushPromises();
    wrapper.setData({ value: '' });
    await flushPromises();

    expect(error.text()).toBeTruthy();
  });

  test('falls back to DOM events if the model is unwatchable', async () => {
    const wrapper = mount({
      data: () => ({
        input: { value: '' }
      }),
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input type="text" name="field" v-model="input['field']" v-validate="'required'">
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('span');
    wrapper.setData({
      input: {
        value: ''
      }
    });

    await flushPromises();
    expect(error.text()).toBeFalsy();
    wrapper.find('input').trigger('input');
    await flushPromises();
    await Vue.nextTick();
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
      computed: mapValidationState('vee'),
      template: `
        <div>
          <child data-vv-name="field" v-model="input" v-validate="'required'"></child>
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');
    const error = wrapper.find('span');

    await flushPromises();
    expect(error.text()).toBeFalsy();

    input.element.value = '1';
    input.trigger('change');
    await flushPromises();
    input.element.value = '';
    input.trigger('change');
    await flushPromises();
    await Vue.nextTick();

    expect(error.text()).toBeTruthy();
  });

  test('watches the model from the child context if it cannot be watched from the parent', async () => {
    const wrapper = mount({
      components: {
        InputField: {
          props: ['name', 'value'],
          template: `<input type="text" :value="value" @input="$emit('input', $event.target.value)">`
        }
      },
      data: () => ({ inputs: [{ value: '' }] }),
      computed: mapValidationState('vee'),
      template: `
        <div>
          <input-field ref="input" name="field" v-model="inputs[0].value" v-validate="'required|min:3'"></input-field>
          <span>{{ vee.for('field').errors[0] }}</span>
        </div>
      `
    }, { localVue: Vue, sync: false });

    const error = wrapper.find('span');

    await flushPromises();
    expect(error.text()).toBeFalsy();
    wrapper.setData({
      inputs: [{ value: '1' }]
    });

    await flushPromises();
    await Vue.nextTick();

    expect(error.text()).toBeTruthy();
  });
});
