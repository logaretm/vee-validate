import { shallow, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import TestComponent from './components/Scopes';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('watches input value on input and blur', async () => {
  const wrapper = shallow(TestComponent, { localVue: Vue });

  const validator = wrapper.vm.$validator;
  expect(validator.fields.items).toHaveLength(4);

  // check if correct scopes were assigned.
  expect(validator.fields.filter({ scope: 'first' })).toHaveLength(1);
  expect(validator.fields.filter({ scope: 'second' })).toHaveLength(1);
  expect(validator.fields.filter({ scope: 'third' })).toHaveLength(2);

  wrapper.setData({
    scope: 'notThird'
  });

  // test scope update
  expect(validator.fields.filter({ scope: 'third' })).toHaveLength(0);
  expect(validator.fields.filter({ scope: 'notThird' })).toHaveLength(2);
});
