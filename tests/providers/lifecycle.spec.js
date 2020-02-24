import flushPromises from 'flush-promises';
import { ValidationProvider, ValidationObserver } from '@/index.full';

// This is a vue-test-utils issue, maybe after they disable the "sync" behavior.
// eslint-disable-next-line
test.skip('handles keep-alive activation/deactivation life-cycles', async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const TheRealVue = require('vue');
  const vm = new TheRealVue({
    components: {
      ValidationProvider,
      ValidationObserver
    },
    data: () => ({
      value: '',
      isHidden: false
    }),
    template: `
    <div>
      <ValidationObserver v-slot="{ errors }">
        <keep-alive>
          <ValidationProvider
            v-if="!isHidden"
            vid="myfield"
            rules="required|min:3|max:6"
            v-slot="_"
          >
            <input type="text" v-model="value">
          </ValidationProvider>
        </keep-alive>
        <span>{{ errors }}</span>
      </ValidationObserver>
      <button @click="isHidden = !isHidden">Toggle</button>
    </div>
    `
  });

  vm.$mount();
  await flushPromises();

  const button = vm.$el.querySelector('button');
  await vm.nextTick();
  vm.value = 'se';
  await vm.nextTick();
  expect(vm.$el.querySelector('span').textContent).toContain('myfield');
  button.click();
  await vm.nextTick();
  expect(vm.$el.querySelector('span').textContent).not.toContain('myfield');
  button.click();
  await vm.nextTick();
  expect(vm.$el.querySelector('span').textContent).toContain('myfield');
});
