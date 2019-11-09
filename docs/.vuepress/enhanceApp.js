import { ValidationProvider, ValidationObserver } from '../../dist/vee-validate.full.esm';
import Example from './components/Example';

export default ({ Vue }) => {
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('Example', Example);
};
