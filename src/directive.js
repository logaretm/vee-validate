import listeners from './utils/listeners';

export default (options) => ({
    bind() {
        listeners.attach(this, options);
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
                this.vm.$validator.validate(this.fieldName, value);
            });

            return;
        }

        this.vm.$validator.validate(this.fieldName, value);
    },
    unbind() {
        listeners.detach(this);
    }
});
