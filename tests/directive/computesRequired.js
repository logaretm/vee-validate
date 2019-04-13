import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import VeeValidate, { mapValidationState, mapValidationActions } from '@/index';

const Vue = createLocalVue();
const Validator = VeeValidate.Validator;

Vue.use(VeeValidate);

test('testing computesRequired rule (here required_if)', async () => {
  Validator.localize('en');
  await flushPromises();

  const wrapper = mount({
    computed: {
      ...mapValidationState('vee')
    },
    methods: {
      ...mapValidationActions(['validate'])
    },
    template: `
      <div>
        <input type="text" name="f1" v-validate="'required_if:text,foo,baz|between:20,30'" id="f1" />
        <input type="text" name="f1-continues" v-validate.continues="'required_if:text,foo,baz|between:20,30'" id="f1-continues" />
        <input type="text" name="f2" ref="text" id="f2" v-validate />
        <span id="f1-errors">{{ vee.for('f1').errors[0] }}</span>
        <span id="f1-continues-errors">{{ vee.for('f1-continues').errors[0] }}</span>
        <span id="f2-errors">{{ vee.for('f2').errors[0] }}</span>
      </div>
    `
  }, { localVue: Vue, sync: false });

  let input = wrapper.find('#f1');
  let inputCont = wrapper.find('#f1-continues');
  let ref = wrapper.find('#f2');

  // We fill the ref element with some unrelevant value
  ref.element.value = 'test';
  ref.trigger('input');
  await flushPromises();
  await wrapper.vm.validate();
  expect(wrapper.find('#f1-errors').text()).toBeFalsy();
  // No errors because :
  // - the ref element doesn't have "foo" or "baz" as value -> the input field is not required
  // - input previously stated as "not required", not filled & not `.continues` -> the between rule is not executed

  expect(wrapper.find('#f1-continues-errors').text()).toBe('The f1-continues field must be between 20 and 30.');
  // The `.continues` input has the `between` rule error, it's good because `.continues` has to run through all the rules

  // Now we fill the ref element with one of the two 'required_if' values
  ref.element.value = 'baz';
  ref.trigger('input');
  await flushPromises();
  expect(wrapper.find('#f1-errors').text()).toBe('The f1 field is required when the text field has this value.');
  expect(wrapper.find('#f1-continues-errors').text()).toBe('The f1-continues field is required when the text field has this value.');

  // We fill the input with numbers ; it should silent the require_if error, and let the between rule trigger
  input.element.value = '10';
  inputCont.element.value = '10';
  input.trigger('input');
  inputCont.trigger('input');
  await flushPromises();

  // The 'between' rule is the first (& only one) triggered error
  expect(wrapper.find('#f1-errors').text()).toBe('The f1 field must be between 20 and 30.');
  expect(wrapper.find('#f1-continues-errors').text()).toBe('The f1-continues field must be between 20 and 30.');

  // We fill the input with correct values, and everything should be fine now
  input.element.value = '25';
  inputCont.element.value = '25';
  input.trigger('input');
  inputCont.trigger('input');
  await flushPromises();
  const errors = wrapper.findAll('span');
  expect(errors.at(0).text()).toBe(''); // No errors left
  expect(errors.at(1).text()).toBe(''); // No errors left
  expect(errors.at(2).text()).toBe(''); // No errors left
});
