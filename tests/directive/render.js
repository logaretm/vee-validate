import { mount, createLocalVue } from '@vue/test-utils';
import VeeValidate from '@/index';

test('does not modify the DOM rendering', () => {
  const Vue = createLocalVue();
  Vue.use(VeeValidate);

  const component = {
    template: `<input type="text" name="field" v-validate="'required'">`
  };

  const first = mount(component, { localVue: Vue });
  const second = mount(component, { localVue: Vue });

  // same component, should match in UI and in rendered HTML.
  expect(first.html()).toBe(second.html());
});
