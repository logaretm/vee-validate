import debounce from './utils/debouncer.js';

const DEFAULT_DELAY = 0;

export default (options) => ({
    params: ['rules', 'delay', 'reject', 'initial'],
    onInput() {
        this.vm.$validator.validate(this.fieldName, this.el.value);
    },
    onFileInput() {
        if (! this.vm.$validator.validate(this.fieldName, this.el.files)
        && this.params.reject) {
            this.el.value = '';
        }
    },
    attachValidator() {
        this.vm.$validator.attach(this.fieldName, this.params.rules);
    },
    bind() {
        this.fieldName = this.expression || this.el.name;
        this.attachValidator();

        if (this.expression) {
            return;
        }

        this.attachValidator();
        const handler = this.el.type === 'file' ? this.onFileInput : this.onInput;
        this.handles = this.el.type === 'file' ? 'change' : 'input';

        const delay = this.params.delay || (options && options.delay) || DEFAULT_DELAY;
        this.handler = delay ? debounce(handler.bind(this), delay) : handler.bind(this);
        this.el.addEventListener(this.handles, this.handler);
    },
    update(value) {
        if (! this.expression) {
            return;
        }

        if (this.params.initial) {
            this.params.initial = false;

            return;
        }

        this.vm.$validator.validate(this.fieldName, value);
    },
    unbind() {
        if (this.handler) {
            this.el.removeEventListener(this.handles, this.handler);
        }

        this.vm.$validator.detach(this.fieldName);
    }
});
