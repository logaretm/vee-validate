import { ValidationProvider, ValidationObserver, extend } from '../../dist/vee-validate.full.esm';

export default ({ Vue }) => {
  Vue.mixin({
    methods: {
      extendRule (...args) {
        return extend(...args);
      }
    }
  })
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
};
