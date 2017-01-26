import Validator from './validator';
import { register } from './utils/maps';
import mixin from './mixin';
import directive from './directives/validate';
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

    Object.defineProperties(Vue.prototype, {
        $validator: {
            get() {
                return register(this);
            }
        }
    });

    Vue.mixin(mixin(options)); // Install Mixin.
    Vue.directive('validate', directive(options));
};

export default {
    install,
    Validator,
    ErrorBag,
    version: '__VERSION__'
};
