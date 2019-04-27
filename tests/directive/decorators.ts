import { mount, createLocalVue } from '@vue/test-utils';
import * as flushPromises from 'flush-promises';
import { Component, Vue } from 'vue-property-decorator';
import { install, ValidationAction, ValidationState, MappedValidationState } from '../../src/index';

@Component({
  template: `
    <div>
      <input type="text" v-validate="'required'" name="field" />
      <span>{{ veeState.for('field').errors[0] }}</span>
      <button @click="validate">Validate</button>
    </div>
  `
})
class App extends Vue {
  public value = '';
  public isValid?: boolean = undefined;

  @ValidationState()
  public readonly veeState!: MappedValidationState;

  @ValidationAction('validate')
  validate(result: boolean) {
    this.isValid = result;
  }

  @ValidationAction('reset')
  reset() {
    this.isValid = undefined;
  }
}

const localVue = createLocalVue();
localVue.use(install);

test('ValidationState and ValidationAction decorators', async () => {
  const wrapper = mount(App, {
    localVue,
    sync: false
  });

  const error = wrapper.find('span');
  expect(error.text()).toBe('');
  wrapper.find('button').trigger('click');
  await flushPromises();
  expect(error.text()).not.toBe('');
  expect(wrapper.vm.isValid).toBe(false);

  wrapper.vm.reset();
  await flushPromises();
  // use the stub
  (requestAnimationFrame as any).step();
  await flushPromises();

  expect(error.text()).toBe('');
  expect(wrapper.vm.isValid).toBe(undefined);
});
