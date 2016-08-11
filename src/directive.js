import debounce from './utils/debouncer.js';

const DEFAULT_DELAY = 0;
const DEFAULT_EVENT_NAME = '$veeValidate';

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
        this.vm.$validator.attach(this.fieldName, this.params.rules);

        if (this.expression) {
            this.attachValidatorEvent();

            return;
        }

        const handler = this.el.type === 'file' ? this.onFileInput : this.onInput;
        this.handles = this.el.type === 'file' ? 'change' : 'input';

        const delay = this.params.delay || (options && options.delay) || DEFAULT_DELAY;
        this.handler = delay ? debounce(handler.bind(this), delay) : handler.bind(this);
        this.el.addEventListener(this.handles, this.handler);

        this.attachValidatorEvent();
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
        this.vm.$off(DEFAULT_EVENT_NAME, this.validateCallback);
    }
});
