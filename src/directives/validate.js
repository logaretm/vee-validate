import ListenerGenerator from '../listeners';
import { getScope, isObject } from '../utils/helpers';

const listenersInstances = [];

export default (options) => ({
    bind(el, binding, vnode) {
        const listener = new ListenerGenerator(el, binding, vnode, options);
        listener.attach();
        listenersInstances.push({ vm: vnode.context, el, instance: listener });
    },
    update(el, { expression, value, oldValue }, { context }) {
        if (! expression || JSON.stringify(value) === JSON.stringify(oldValue)) return;

        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        const scope = isObject(value) ? (value.scope || getScope(el)) : getScope(el);
        context.$validator.updateField(
            holder.instance.fieldName,
            isObject(value) ? value.rules : value,
            { scope }
        );
    },
    unbind(el, { value }, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        if (typeof holder === 'undefined') {
            return;
        }

        const scope = isObject(value) ? value.scope : getScope(el);
        context.$validator.detach(holder.instance.fieldName, scope);
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
