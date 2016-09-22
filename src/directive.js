import listeners from './utils/listeners';
import { getScope } from './utils/helpers';

export default (options) => ({
    bind(el, binding, { context }) {
        listeners.attach(el, binding, { context }, options);
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value, getScope(el));
    },
    unbind(el, binding, { context }) {
        listeners.detach(el, context);
    }
});
