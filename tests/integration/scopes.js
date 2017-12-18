import { shallow, createLocalVue } from 'vue-test-utils';
import flushPromises from 'flush-promises';
import VeeValidate from './../../src/index';
import TestComponent from './components/Scopes';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('watches input value on input and blur', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  const validator = wrapper.vm.$validator;
  expect(validator.fields.items.length).toBe(4);

  // check if correct scopes were assigned.
  expect(validator.fields.filter({ scope: 'first' }).length).toBe(1);
  expect(validator.fields.filter({ scope: 'second' }).length).toBe(1);
  expect(validator.fields.filter({ scope: 'third' }).length).toBe(2);

  wrapper.setData({
    scope: 'notThird'
  });

  // test scope update
  expect(validator.fields.filter({ scope: 'third' }).length).toBe(0);
  expect(validator.fields.filter({ scope: 'notThird' }).length).toBe(2);
});
