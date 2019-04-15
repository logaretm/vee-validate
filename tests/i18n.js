import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

test('can provider an initial dictionary to be merged', async () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate, {
    dictionary: {
      en: {
        messages: {
          required: 'fill this'
        }
      }
    }
  });
  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input name="field" v-validate="'required'" type="text">
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `,
  }, { localVue, sync: false });

  const input = wrapper.find('input');
  const span = wrapper.find('span');

  input.setValue('');
  await flushPromises();
  expect(span.text()).toBe('fill this');
});

test('can implement custom i18n driver', async () => {
  const localVue = createLocalVue();
  VeeValidate.setI18nDriver({
    getFieldMessage () {
      return 'custom dictionary!';
    },
    getAttribute () {
      return null;
    },
    merge () {}
  });

  localVue.use(VeeValidate);

  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input name="field" v-validate="'required'" type="text">
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `,
  }, { localVue, sync: false });

  const input = wrapper.find('input');
  const span = wrapper.find('span');

  input.setValue('');
  await flushPromises();
  expect(span.text()).toBe('custom dictionary!');
  VeeValidate.setI18nDriver('default');
});

test('can provide custom messages for specific fields', async () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate, {
    dictionary: {
      en: {
        custom: {
          field: {
            required: 'fill me'
          }
        }
      }
    }
  });

  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input name="field" v-validate="'required'" type="text">
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `,
  }, { localVue, sync: false });

  const input = wrapper.find('input');
  const span = wrapper.find('span');

  input.setValue('');
  await flushPromises();
  expect(span.text()).toBe('fill me');
});

test('can provide custom names for specific fields', async () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate, {
    dictionary: {
      en: {
        attributes: {
          field: 'My Field'
        },
        custom: {
          field: {
            required: (fieldName) => `fill ${fieldName}`
          }
        }
      }
    }
  });

  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input name="field" v-validate="'required'" type="text">
        <span>{{ vee.for('field').errors[0] }}</span>
      </div>
    `,
  }, { localVue, sync: false });

  const input = wrapper.find('input');
  const span = wrapper.find('span');

  input.setValue('');
  await flushPromises();
  expect(span.text()).toBe('fill My Field');
});

test('falls back to the default english message key if rule has not message', async () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate, {
    locale: 'ar',
    dictionary: {
      en: {
        messages: {
          required: '',
          _default: 'Nah'
        }
      }
    }
  });

  const wrapper = mount({
    computed: mapValidationState('vee'),
    template: `
      <div>
        <input name="name" v-validate="'required'" type="text">
        <span>{{ vee.for('name').errors[0] }}</span>
      </div>
    `,
  }, { localVue, sync: false });

  const input = wrapper.find('input');
  const span = wrapper.find('span');

  input.setValue('');
  await flushPromises();
  expect(span.text()).toBe('Nah');
});
