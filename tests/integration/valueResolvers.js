import { shallow, mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import HTMLInputsTestComponent from './components/Types';
import ComponentsTestComponent from './components/Resolvers';
import InputWithResolvers from './components/stubs/Input';
import InputWithoutResolvers from './components/stubs/InputWithoutValueResolver';
import InputWithoutProps from './components/stubs/InputWithoutProps';

describe('resolves native HTML Inputs values', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = shallow(HTMLInputsTestComponent, { localVue: Vue, attachToDocument: true });

  test('text fields', () => {
    const input = wrapper.find('#text');
    const field = wrapper.vm.$validator.fields.find({ name: 'textField' });
    expect(field.value).toBe('');
    input.element.value = 'hey';
    expect(field.value).toBe('hey');
  });

  test('radio buttons fields', () => {
    const input = wrapper.find('#rad1');
    const field = wrapper.vm.$validator.fields.find({ name: 'radioField' });
    expect(field.value).toBe(undefined);
    // we need to set the element attribute
    input.element.checked = true;
    expect(field.value).toBe(input.element.value);
  });

  test('checkbox fields', () => {
    const input = wrapper.find('#cb1');
    const field = wrapper.vm.$validator.fields.find({ name: 'checkboxField' });
    expect(field.value).toBe(undefined);

    // we need to set the element attribute
    input.element.checked = true;
    expect(field.value).toEqual([input.element.value]);
  });

  test('select fields', () => {
    const input = wrapper.find('#select');
    const field = wrapper.vm.$validator.fields.find({ name: 'selectField' });
    expect(field.value).toBe('');
    // we need to set the element attribute
    input.element.selectedIndex = 1;
    expect(field.value).toBe(input.element.options[1].value);
  });

  test('select multiple fields', () => {
    const input = wrapper.find('#selectMul');
    const field = wrapper.vm.$validator.fields.find({ name: 'selectMulField' });
    expect(field.value).toEqual([]);

    Array.from(input.element.options).forEach(option => {
      option.selected = true;
    });

    expect(field.value).toEqual(Array.from(input.element.options, opt => opt.value));
  });

  test('file fields', () => {
    const field = wrapper.vm.$validator.fields.find({ name: 'fileField' });
    expect(field.value).toEqual([]); // empty list of inputs
  });
});

describe('resolves custom components values', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);
  const wrapper = mount(ComponentsTestComponent, { localVue: Vue });

  test('uses the default value prop resolver', () => {
    const comp = wrapper.find(InputWithoutResolvers);
    const field = wrapper.vm.$validator.fields.find({ name: 'no-resolver' });
    // because it fetches the value from the props.
    expect(field.value).toBe(undefined);

    comp.setProps({
      value: 'val'
    });
    expect(field.value).toBe('val');
  });

  test('uses the data-vv-value path attribute', () => {
    const comp = wrapper.find(InputWithoutProps);
    const field = wrapper.vm.$validator.fields.find({ name: 'no-props' });
    // because it fetches the value from the component data.
    expect(field.value).toBe(null);
    comp.setData({ input: 'heya' });
    expect(field.value).toBe('heya');
  });

  test('uses the defined resolver in component options', () => {
    const comp = wrapper.find(InputWithResolvers);
    const field = wrapper.vm.$validator.fields.find({ name: 'with-resolver' });
    // because it fetches the value from the input element.
    expect(field.value).toBe('');

    comp.find('input').element.value = 'heya';
    expect(field.value).toBe('heya');
  });
});
