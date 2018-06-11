import mixin from './mixin';
import directive from './directive';
import Config from './config';
import Validator from './core/validator';
import { warn, detectPassiveSupport } from './core/utils';

let Vue;

function install (_Vue, options = {}) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      warn('already installed, Vue.use(VeeValidate) should only be called once.');
    }
    return;
  }

  detectPassiveSupport();
  Vue = _Vue;
  const localVue = new Vue();
  Config.register('vm', localVue);
  const validator = new Validator(options);
  Config.register('validator', validator);
  Config.merge(options);

  const { dictionary, i18n } = Config.current;

  if (dictionary) {
    validator.localize(dictionary); // merge the dictionary.
  }

  const onLocaleChanged = () => {
    validator.errors.regenerate();
  };

  // watch locale changes using localVue instance or i18n.
  if (!i18n) {
    if (typeof window !== 'undefined') {
      localVue.$on('localeChanged', onLocaleChanged);
    }
  } else {
    i18n._vm.$watch('locale', onLocaleChanged);
  }

  if (!i18n && options.locale) {
    validator.localize(options.locale); // set the locale
  }

  Validator.setStrictMode(Config.current.strict);

  Vue.mixin(mixin);
  Vue.directive('validate', directive);
};

export default install;
