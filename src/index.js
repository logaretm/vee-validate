import Validator, { register } from './validator';
import mixin from './mixin';
import directive from './directive';
import ErrorBag from './errorBag';

const DEFAULT_EVENT_NAME = 'validate';

/**
 * Installs the plugin.
 */
const install = (Vue, options) => {
    Object.defineProperties(Vue.prototype, {
        $validator: {
            get() {
                return register(this, (options && options.eventName) || DEFAULT_EVENT_NAME);
            }
        }
    });

    Vue.mixin(mixin(options)); // Install Mixin.
    Vue.directive('validate', directive(options)); // Install directive.
};

export { install, Validator, ErrorBag };
