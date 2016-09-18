import debounce from './utils/debouncer.js';

const DEFAULT_EVENT_NAME = 'veeValidate';

const getScope = (el) => el.dataset.scope || (el.form && el.form.dataset.scope) || undefined;

const hasFieldDependency = (rules) => {
    const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
    if (! results.length) {
        return false;
    }

    return results[0].split(':')[1];
};

export default (options) => ({
    onInput() {
        this.vm.$validator.validate(this.fieldName, this.el.value, getScope(this.el));
    },
    onFileInput() {
        if (! this.vm.$validator.validate(this.fieldName, this.el.files, getScope(this.el))
        && this.modifiers.reject) {
            this.el.value = '';
        }
    },
    onChange() {
        const el = document.querySelector(`input[name="${this.fieldName}"]:checked`);
        this.vm.$validator.validate(this.fieldName, el.value, getScope(el));
    },
    getInputHandler() {
        if (this.el.type === 'file') {
            return this.onFileInput;
        }

        if (this.el.type === 'radio') {
            return this.onChange;
        }

        return this.onInput;
    },
    getEventName() {
        if (this.el.type === 'file') {
            return 'change';
        }

        if (this.el.type === 'radio') {
            return 'change';
        }

        return 'input';
    },
    attachValidatorEvent() {
        const elScope = getScope(this.el);
        let callback = elScope ? (scope) => {
            if (scope === elScope) {
                this.vm.$validator.validate(this.fieldName, this.el.value, elScope);
            }
        } : () => {
            this.vm.$validator.validate(this.fieldName, this.el.value, elScope);
        };

        if (this.el.type === 'radio') {
            callback = () => {
                const el = document.querySelector(`input[name="${this.fieldName}"]:checked`);
                if (! el) {
                    this.vm.$validator.validate(this.fieldName, null, null);
                    return;
                }

                this.vm.$validator.validate(this.fieldName, el.value, getScope(el));
            };
        }

        this.validatorCallback = callback;
        this.vm.$on(DEFAULT_EVENT_NAME, this.validatorCallback);
        const fieldName = hasFieldDependency(this.el.dataset.rules);
        if (this.el.dataset.rules && fieldName) {
            this.vm.$once('validatorReady', () => {
                document.querySelector(`input[name='${fieldName}']`)
                        .addEventListener('input', () => {
                            this.vm.$validator.validate(this.fieldName, this.el.value, elScope);
                        });
            });
        }
    },
    attachInputEvent(name, handler) {
        if (this.el.type === 'radio') {
            document.querySelectorAll(`input[name="${this.fieldName}"]`).forEach(el => {
                el.addEventListener(name, handler.bind(this));
            });

            return;
        }

        this.el.addEventListener(name, handler);
    },
    bind() {
        this.vm.$nextTick(() => {
            this.fieldName = this.expression || this.el.name;
            this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);
            if (this.expression) {
                this.attachValidatorEvent();

                return;
            }

            const handler = this.getInputHandler();
            this.handles = this.getEventName();

            const delay = this.el.dataset.delay || options.delay;
            this.handler = delay ? debounce(handler.bind(this), delay) : handler.bind(this);

            this.attachInputEvent(this.handles, this.handler);
            this.attachValidatorEvent();
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
                this.vm.$validator.validate(this.fieldName, value);
            });

            return;
        }

        this.vm.$validator.validate(this.fieldName, value);
    },
    unbind() {
        if (this.handler) {
            if (this.el.type === 'radio') {
                document.querySelectorAll(`input[name="${this.fieldName}"]`).forEach(el => {
                    el.removeEventListener(this.handles, this.handler);
                });
            } else {
                this.el.removeEventListener(this.handles, this.handler);
            }
        }

        this.vm.$validator.detach(this.fieldName);
        this.vm.$off(DEFAULT_EVENT_NAME, this.validatorCallback);
    }
});
