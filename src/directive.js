import ListenerGenerator from './listeners';
import { getScope } from './utils/helpers';

const listenersInstances = [];

export default (options) => ({
    bind(el, binding, { context }) {
        const listener = new ListenerGenerator(el, binding, context, options);
        listener.attach();
        listenersInstances.push({ vm: context, el, instance: listener });
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value, getScope(el));
    },
    unbind(el, binding, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        holder.instance.detach();
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
