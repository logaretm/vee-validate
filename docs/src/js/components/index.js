import CodeBlock from './CodeBlock.vue';
import CodeExample from './CodeExample.vue';
import AnimatedButton from './AnimatedButton.vue';

// eslint-disable-next-line
const loadAsync = (name) => () => import(`./examples/${name}.vue`);

// Examples.
const DelayExample = loadAsync('Delay');
const BasicExample = loadAsync('Basic');
const LocaleExample = loadAsync('Locale');
const RejectExample = loadAsync('FileReject');
const ScopeExample = loadAsync('Scopes');
const DataExample = loadAsync('Data');
const FormExample = loadAsync('Form');
const CouponExample = loadAsync('Coupon');
const RadioButtonsExample = loadAsync('RadioButtons');
const CheckboxExample = loadAsync('Checkbox');
const FlagsExample = loadAsync('Flags');
const SelectorsExample = loadAsync('Selectors');
const ComponentExample = loadAsync('Component');
const EventBusExample = loadAsync('EventBusParent');
const ValidatorExample = loadAsync('ValidatorExample');
const BackendExample = loadAsync('Backend');


export default (Vue) => {
  Vue.component(AnimatedButton.name, AnimatedButton);
  Vue.component(CodeBlock.name, CodeBlock);
  Vue.component(CodeExample.name, CodeExample);

  Vue.component('basic-example', BasicExample);
  Vue.component('delay-example', DelayExample);
  Vue.component('locale-example', LocaleExample);
  Vue.component('reject-example', RejectExample);
  Vue.component('scopes-example', ScopeExample);
  Vue.component('data-example', DataExample);
  Vue.component('form-example', FormExample);
  Vue.component('coupon-example', CouponExample);
  Vue.component('radio-buttons-example', RadioButtonsExample);
  Vue.component('checkbox-example', CheckboxExample);
  Vue.component('flags-example', FlagsExample);
  Vue.component('component-example', ComponentExample);
  Vue.component('event-bus-example', EventBusExample);
  Vue.component('selectors-example', SelectorsExample);
  Vue.component('validator-example', ValidatorExample);
  Vue.component('backend-example', BackendExample);
};
