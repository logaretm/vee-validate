import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState } from '@/index';

describe('Fields can be given an alias for messages', () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate);

  test('aliases can be specified with data-vv-as attr', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate.immediate="'required'" data-vv-as="Alias">
        <span>{{ vee.for('aliasTest').errors[0] }}</span>
      </div>
    `,
      data: () => ({ value: '' })
    }, { localVue, sync: false });

    await flushPromises();

    expect(wrapper.find('span').text()).toBe('The Alias field is required.');
  });

  test('aliases can be specified with dictionary API', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate.immediate="'required'">
        <span>{{ vee.for('aliasTest').errors[0] }}</span>
      </div>
    `,
      data: () => ({ value: '' })
    }, { localVue, sync: false });

    VeeValidate.Validator.localize({
      en: {
        attributes: {
          aliasTest: 'Alias'
        }
      }
    });

    await flushPromises();

    expect(wrapper.find('span').text()).toBe('The Alias field is required.');
  });

  test('aliases can be set with the ctor options', async () => {
    const wrapper = mount({
      computed: mapValidationState('vee'),
      template: `
        <div>
          <TextInput v-model="value" v-validate.immediate="'required'" name="bar" label="foo"></TextInput>
          <span>{{ vee.for('bar').errors[0] }}</span>
        </div>
        `,
      data: () => ({
        value: ''
      }),
      components: {
        TextInput: {
          template: `<input type="text">`,
          $_veeValidate: {
            name () {
              return this.$attrs.name;
            },
            alias () {
              return this.$attrs.label;
            }
          }
        }
      }
    }, { localVue, sync: false });

    await flushPromises();

    expect(wrapper.find('span').text()).toBe('The foo field is required.');
  });
});
