import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';

describe('Scopes', () => {
  test('assigns scopes to fields', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      data: () => ({ scope: 'third' }),
      template: `
      <div>
        <form action="" data-vv-scope="first">
          <input type="text" v-validate="'required'" name="firstField">
          <input type="text" v-validate="'required'" name="secondField" data-vv-scope="second">
        </form>

        <form :data-vv-scope="scope">
          <input type="text" v-validate="'required'" name="thirdField">
        </form>
        <input type="text" v-validate="'required'" name="fourthField" :data-vv-scope="scope">
      </div>
    `
    }, { localVue: Vue });

    const validator = wrapper.vm.$validator;
    expect(validator.fields).toHaveLength(4);

    // check if correct scopes were assigned.
    expect(validator.fields.filter(f => f.matches({ scope: 'first' }))).toHaveLength(1);
    expect(validator.fields.filter(f => f.matches({ scope: 'second' }))).toHaveLength(1);
    expect(validator.fields.filter(f => f.matches({ scope: 'third' }))).toHaveLength(2);

    wrapper.setData({
      scope: 'notThird'
    });

    // test scope update
    expect(validator.fields.filter(f => f.matches({ scope: 'third' }))).toHaveLength(0);
    expect(validator.fields.filter(f => f.matches({ scope: 'notThird' }))).toHaveLength(2);
  });

  test('assigns scopes to custom components', async () => {
    const Vue = createLocalVue();
    Vue.use(VeeValidate);

    const wrapper = mount({
      components: {
        TextInput: {
          template: `<div></div>`
        }
      },
      template: `
        <div>
          <input type="text" v-validate="'required'" data-vv-scope="s1">
        </div>
      `
    }, { localVue: Vue });

    const validator = wrapper.vm.$validator;
    expect(validator.fields.filter(f => f.matches({ scope: 's1' }))).toHaveLength(1);
  });
});
