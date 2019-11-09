import { ValidationProvider, ValidationObserver, extend } from '../../dist/vee-validate.full.esm';
import Example from './components/Example';

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
  Vue.component('Example', Example);

};
