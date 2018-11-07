import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

test('automatic classes applied on inputs', async () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate, {
    classes: true,
    classNames: {
      valid: ['is-valid', 'text-green'],
      invalid: ['is-invalid', 'text-red']
    }
  });

  const wrapper = mount({
    template: `<input type="text" name="field" v-validate="'required'">`
  }, { localVue: Vue });

  const input = wrapper.find('input');

  expect(input.classes()).toContain('untouched'); // hasn't been touched
  expect(input.classes()).not.toContain('touched');
  expect(input.classes()).toContain('pristine'); // hasn't been changed yet.
  expect(input.classes()).not.toContain('dirty');

  input.trigger('blur');
  await flushPromises();

  expect(input.classes()).not.toContain('untouched'); // has been touched
  expect(input.classes()).toContain('touched');
  expect(input.classes()).toContain('pristine'); // hasn't been changed yet.
  expect(input.classes()).not.toContain('dirty');

  input.trigger('input');
  await flushPromises();

  expect(input.classes()).not.toContain('pristine'); // has been changed.
  expect(input.classes()).toContain('dirty');

  input.element.value = '10';
  input.trigger('input');
  await flushPromises();

  expect(input.classes()).not.toContain('text-red'); // triggered by blur
  expect(input.classes()).toContain('text-green');
  expect(input.classes()).not.toContain('is-invalid');
  expect(input.classes()).toContain('is-valid');
});
