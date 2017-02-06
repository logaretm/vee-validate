import Validator from './validator';
import makeMixin from './mixin';
import makeDirective from './directive';
import ErrorBag from './errorBag';
import { assign } from './utils';

const DEFAULT_CLASS_NAMES = {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
};

// eslint-disable-next-line
const install = (Vue, { locale = 'en', delay = 0, errorBagName = 'errors', dictionary = null, strict = true, fieldsBagName = 'fields', enableAutoClasses = false, classNames = {} } = {}) => {
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
    classNames: assign({}, DEFAULT_CLASS_NAMES, classNames)
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
