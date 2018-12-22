import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from '@/index';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('value resolution using ctor options', async () => {
  let db = { value: '123' };
  const wrapper = mount({
    components: {
      MyInput: {
        $_veeValidate: {
          value () {
            return db.value;
          }
        },
        template: `
          <div></div>
        `
      }
    },
    template: `
      <div>
        <MyInput v-validate="'required'" data-vv-name="myinput" />
        <p id="error">{{ errors.first('myinput') }}</p>
        <button @click="$validator.validate()">Validate</button>
      </div>  
    `
  }, { localVue: Vue, sync: false });

  wrapper.find('button').trigger('click');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBeFalsy();

  db.value = '';
  wrapper.find('button').trigger('click');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBeTruthy();
});

test('value resolution using data-vv-value-path attr', async () => {
  let db = { value: '123' };
  const wrapper = mount({
    components: {
      MyInput: {
        data: () => ({
          db
        }),
        template: `
          <div></div>
        `
      }
    },
    template: `
      <div>
        <MyInput v-validate="'required'" data-vv-name="myinput" data-vv-value-path="db.value" />
        <p id="error">{{ errors.first('myinput') }}</p>
        <button @click="$validator.validate()">Validate</button>
      </div>  
    `
  }, { localVue: Vue, sync: false });

  wrapper.find('button').trigger('click');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBeFalsy();

  db.value = '';
  wrapper.find('button').trigger('click');
  await flushPromises();
  expect(wrapper.find('#error').text()).toBeTruthy();
});
