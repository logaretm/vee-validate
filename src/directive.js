import ListenerGenerator from './listeners';
import { getScope } from './utils/helpers';

const listenersInstances = [];

export default (options) => ({
    bind() {
        this.vm.$nextTick(() => {
            this.fieldName = this.expression || this.el.name;
            const binding = { expression: this.expression, modifiers: this.modifiers };
            const listener = new ListenerGenerator(this.el, binding, { context: this.vm }, options);
            listener.attach();
            listenersInstances.push({ vm: this.vm, el: this.el, instance: listener });
        });
    },
    update(value) {
        if (! this.expression) {
            return;
        }

        if (this.modifiers.initial) {
            this.modifiers.initial = false;

            return;
        }

        // might be not ready yet.
        if (! this.fieldName) {
            this.vm.$nextTick(() => {
                this.vm.$validator.validate(this.fieldName, value, getScope(this.el));
            });

            return;
        }

        this.vm.$validator.validate(this.fieldName, value, getScope(this.el));
    },
    unbind() {
        const holder = listenersInstances.filter(l => l.vm === this.vm && l.el === this.el)[0];
        holder.instance.detach();
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
