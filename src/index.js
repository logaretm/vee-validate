import Validator from './validator';
import makeMixin from './mixin';
import makeDirective from './directives/validate';
import ErrorBag from './errorBag';

// eslint-disable-next-line
const install = (Vue, { locale = 'en', delay = 0, errorBagName = 'errors', dictionary = null, strict = true, fieldsBagName = 'fields', enableAutoClasses = false, classNames = null } = {}) => {
  if (dictionary) {
    Validator.updateDictionary(dictionary);
  }

  Validator.setLocale(locale);
  Validator.setStrictMode(strict);

  const options = {
    locale,
    delay,
    dictionary,
    errorBagName,
    fieldsBagName,
    enableAutoClasses,
    classNames
  };

  Vue.mixin(makeMixin(options));
  Vue.directive('validate', makeDirective(options));
};

export default {
  install,
  Validator,
  ErrorBag,
  version: '__VERSION__'
};
