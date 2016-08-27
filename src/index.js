import Validator from './validator';
import { register } from './utils/maps';
import mixin from './mixin';
import directive from './directive';
import ErrorBag from './errorBag';

/**
 * Installs the plugin.
 */
const install = (Vue, { locale, delay, errorBagName, messages, strict } = {
    locale: 'en',
    delay: 0,
    errorBagName: 'errors',
    messages: null,
    strict: true
}) => {
    if (messages) {
        Validator.updateDictionary(messages);
    }

    Validator.setDefaultLocale(locale);
    Validator.setStrictMode(strict);

    const options = {
        locale,
        delay,
        messages,
        errorBagName
    };

    Object.defineProperties(Vue.prototype, {
        $validator: {
            get() {
                return register(this);
            }
        }
    });

    Vue.mixin(mixin(options)); // Install Mixin.
    Vue.directive('validate', directive(options)); // Install directive.
};

export { install, Validator, ErrorBag };
