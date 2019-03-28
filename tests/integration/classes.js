import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

describe('Automatic Classes', () => {
  test('touched untouched classes applied on blur', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate, {
      classes: true
    });

    const wrapper = mount({
      template: `<input type="text" name="field" v-validate="'required'">`
    }, { localVue: Vue });

    const input = wrapper.find('input');
    await flushPromises();

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
  });

  test('input evt applies valid invalid dirty classes', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate, {
      classes: true,
      classNames: {
        valid: 'is-valid',
        invalid: 'is-invalid'
      }
    });

    const wrapper = mount({
      template: `<input type="text" name="field" v-validate="'required'">`
    }, { localVue: Vue, sync: false });

    const input = wrapper.find('input');

    input.trigger('input');
    await flushPromises();

    expect(input.classes()).not.toContain('pristine'); // has been changed.
    expect(input.classes()).toContain('dirty');

    input.setValue('10');
    await flushPromises();

    expect(input.classes()).not.toContain('is-invalid');
    expect(input.classes()).toContain('is-valid');
  });

  test('multiple classes for same flag', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate, {
      classes: true,
      classNames: {
        untouched: ['is-untouched', 'NOBODY_TOUCHED_ME']
      }
    });

    const wrapper = mount({
      template: `<input type="text" name="field" v-validate="'required'">`
    }, { localVue: Vue });

    const input = wrapper.find('input');

    expect(input.classes()).toContain('is-untouched');
    expect(input.classes()).toContain('NOBODY_TOUCHED_ME');
  });
});
