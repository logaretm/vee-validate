import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

describe('Fields can be given an alias for messages', () => {
  const localVue = createLocalVue();
  localVue.use(VeeValidate);

  test('aliases can be specified with data-vv-as attr', async () => {
    const wrapper = mount({
      template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate.immediate="'required'" data-vv-as="Alias">
        <span>{{ errors.first('aliasTest') }}</span>
      </div>
    `,
      data: () => ({ value: '' })
    }, { localVue });

    await flushPromises();

    expect(wrapper.find('span').text()).toBe('The Alias field is required.');
  });

  test('aliases can be specified with dictionary API', async () => {
    const wrapper = mount({
      template: `
      <div>
        <input name="aliasTest" v-model="value" v-validate="'required'">
        <span>{{ errors.first('aliasTest') }}</span>
      </div>
    `,
      data: () => ({ value: '' })
    }, { localVue });

    wrapper.vm.$validator.localize({
      en: {
        attributes: {
          aliasTest: 'Alias'
        }
      }
    });

    await wrapper.vm.$validator.validate();

    expect(wrapper.find('span').text()).toBe('The Alias field is required.');
  });

  test('aliases can be set with the ctor options', async () => {
    const wrapper = mount({
      template: `<TextInput v-model="value" v-validate="'required'" name="bar" label="foo"></TextInput>`,
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
    }, { localVue });

    await wrapper.vm.$validator.validate();

    expect(wrapper.vm.errors.first('bar')).toBe('The foo field is required.');
  });
});
