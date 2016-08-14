import debounce from './utils/debouncer.js';

const DEFAULT_DELAY = 0;
const DEFAULT_EVENT_NAME = '$veeValidate';

export default (options) => ({
    onInput() {
        this.vm.$validator.validate(this.fieldName, this.el.value);
    },
    onFileInput() {
        if (! this.vm.$validator.validate(this.fieldName, this.el.files)
        && this.modifiers.reject) {
            this.el.value = '';
        }
    },
    attachValidatorEvent() {
        this.validateCallback = this.expression ? () => {
            this.vm.$validator.validate(this.fieldName, this.value);
        } : () => {
            this.handler();
        };

        this.vm.$on(DEFAULT_EVENT_NAME, this.validateCallback);
    },
    bind() {
        this.fieldName = this.expression || this.el.name;
        this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);

        if (this.expression) {
            this.attachValidatorEvent();

            return;
        }

        const handler = this.el.type === 'file' ? this.onFileInput : this.onInput;
        this.handles = this.el.type === 'file' ? 'change' : 'input';

        const delay = this.el.dataset.delay || (options && options.delay) || DEFAULT_DELAY;
        this.handler = delay ? debounce(handler.bind(this), delay) : handler.bind(this);
        this.el.addEventListener(this.handles, this.handler);

        this.attachValidatorEvent();
    },
    update(value) {
        if (! this.expression) {
            return;
        }

        if (this.modifiers.initial) {
            this.modifiers.initial = false;

            return;
        }

        this.vm.$validator.validate(this.fieldName, value);
    },
    unbind() {
        if (this.handler) {
            this.el.removeEventListener(this.handles, this.handler);
        }

        this.vm.$validator.detach(this.fieldName);
        this.vm.$off(DEFAULT_EVENT_NAME, this.validateCallback);
    }
});
