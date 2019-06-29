import { ValidationProvider, ValidationObserver, extend } from '../../dist/vee-validate.full.esm';

export default ({ Vue }) => {
  window.$extendVee = extend;
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
};
