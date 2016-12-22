import ListenerGenerator from './listeners';
import { getScope } from './utils/helpers';

const listenersInstances = [];

export default (options) => ({
    bind(el, binding, vnode) {
        const listener = new ListenerGenerator(el, binding, vnode, options);
        listener.attach();
        listenersInstances.push({ vm: vnode.context, el, instance: listener });
    },
    update(el, { expression, value, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        context.$validator.updateField(holder.instance.fieldName, value);
    },
    unbind(el, binding, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        if (typeof holder === 'undefined') {
            return;
        }

        context.$validator.detach(holder.instance.fieldName, getScope(el));
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
