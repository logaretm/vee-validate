import { shallow, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';
import TestComponent from './components/Types';

describe('handles native inputs with their respective events', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = shallow(TestComponent, { localVue: Vue, attachToDocument: true });

  test('text fields', async () => {
    const input = wrapper.find('#text');
    expect(wrapper.vm.errors.has('textField')).toBe(false);
    input.trigger('change'); // doesn't watch change events
    await flushPromises();
    expect(wrapper.vm.errors.has('textField')).toBe(false);

    input.trigger('input');
    await flushPromises();
    expect(wrapper.vm.errors.has('textField')).toBe(true);
  });

  test('radio buttons fields', async () => {
    const input = wrapper.find('#rad1');
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('radioField')).toBe(true);

    // we need to set the element attribute
    input.element.checked = true;
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('radioField')).toBe(false);
  });

  test('checkbox fields', async () => {
    const input = wrapper.find('#cb1');
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('checkboxField')).toBe(true);

    input.element.checked = true;
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('checkboxField')).toBe(false);
  });

  test('select fields', async () => {
    const input = wrapper.find('#select');
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('selectField')).toBe(true);

    input.element.value = '1';
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('selectField')).toBe(false);
  });

  test('select multiple fields', async () => {
    const input = wrapper.find('#selectMul');
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('selectMulField')).toBe(true);

    Array.from(input.element.options).forEach(option => {
      option.selected = true;
    });

    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('selectMulField')).toBe(false);
  });

  test('file fields', async () => {
    const input = wrapper.find('#file');
    input.trigger('change');
    await flushPromises();
    expect(wrapper.vm.errors.has('fileField')).toBe(true);
  });
});

test('removes listeners on related radio buttons', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, { events: 'input' });
  const wrapper = shallow(TestComponent, { localVue: Vue, attachToDocument: true });
  const field = wrapper.vm.$validator.fields.find({ name: 'radioField' });

  // it has two watchers, one for it and one for its friend
  expect(field.watchers.filter(w => /input_native/.test(w.tag))).toHaveLength(2);
  wrapper.destroy();
  // both should be removed.
  expect(field.watchers.filter(w => /input_native/.test(w.tag))).toHaveLength(0);
});
