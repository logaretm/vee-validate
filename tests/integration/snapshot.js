import { shallow, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';
import TestComponent from './components/Snapshot';

const Vue = createLocalVue();
Vue.use(VeeValidate);

test('snapshots should match', () => {
  const first = shallow(TestComponent, { localVue: Vue });
  const second = shallow(TestComponent, { localVue: Vue });

  // same component, no props, should match in UI and in HTML.
  expect(first.html()).toBe(second.html());
});
