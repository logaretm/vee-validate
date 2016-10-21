import { getScope, debounce, warn } from './utils/helpers';

const DEFAULT_EVENT_NAME = 'veeValidate';

export default class ListenerGenerator
{
    constructor(el, binding, context, options) {
        this.callbacks = [];
        this.el = el;
        this.binding = binding;
        this.vm = context;
        this.options = options;
        this.fieldName = binding.expression || el.name;
    }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */
    _hasFieldDependency(rules) {
        const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
        if (! results.length) {
            return false;
        }

        return results[0].split(':')[1];
    }

    /**
     * Validates input value, triggered by 'input' event.
     */
    _inputListener() {
        this.vm.$validator.validate(this.fieldName, this.el.value, getScope(this.el));
    }

    /**
     * Validates files, triggered by 'change' event.
     */
    _fileListener() {
        const isValid = this.vm.$validator.validate(
            this.fieldName, this.el.files, getScope(this.el)
        );
        if (! isValid && this.binding.modifiers.reject) {
            // eslint-disable-next-line
            el.value = '';
        }
    }

    /**
     * Validates radio buttons, triggered by 'change' event.
     */
    _radioListener() {
        const checked = document.querySelector(`input[name="${this.el.name}"]:checked`);
        if (! checked) {
            this.vm.$validator.validate(this.fieldName, null, getScope(this.el));
            return;
        }

        this.vm.$validator.validate(this.fieldName, checked.value, getScope(this.el));
    }

    /**
     * Validates checkboxes, triggered by change event.
     */
    _checkboxListener() {
        const checkedBoxes = document.querySelectorAll(`input[name="${this.el.name}"]:checked`);
        if (! checkedBoxes || ! checkedBoxes.length) {
            this.vm.$validator.validate(this.fieldName, null, getScope(this.el));
            return;
        }

        [...checkedBoxes].forEach(box => {
            this.vm.$validator.validate(this.fieldName, box.value, getScope(this.el));
        });
    }

    /**
     * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
     * From the event.
     */
    _getScopedListener(callback) {
        return (scope) => {
            if (! scope || scope === getScope(this.el) || scope instanceof Event) {
                callback();
            }
        };
    }

    /**
     * Attaches validator event-triggered validation.
     */
    _attachValidatorEvent() {
        const listener = this._getScopedListener(this._getSuitableListener().listener.bind(this));

        this.vm.$on(DEFAULT_EVENT_NAME, listener);
        this.callbacks.push({ name: DEFAULT_EVENT_NAME, listener });
        this.vm.$on('VALIDATOR_OFF', (field) => {
            if (this.fieldName === field) {
                this.detach();
            }
        });

        const fieldName = this._hasFieldDependency(this.el.dataset.rules);
        if (fieldName) {
            // Wait for the validator ready triggered when vm is mounted because maybe
            // the element isn't mounted yet.
            this.vm.$once('validatorReady', () => {
                const target = document.querySelector(`input[name='${fieldName}']`);
                if (! target) {
                    warn('Cannot find target field, no additional listeners were attached.');
                    return;
                }

                target.addEventListener('input', listener);
                this.callbacks.push({ name: 'input', listener, el: target });
            });
        }
    }

    /**
     * Determines a suitable listener for the element.
     */
    _getSuitableListener() {
        if (this.el.type === 'file') {
            return {
                name: 'change',
                listener: this._fileListener
            };
        }

        if (this.el.type === 'radio') {
            return {
                name: 'change',
                listener: this._radioListener
            };
        }

        if (this.el.type === 'checkbox') {
            return {
                name: 'change',
                listener: this._checkboxListener
            };
        }

        return {
            name: 'input',
            listener: this._inputListener
        };
    }

    /**
     * Attachs a suitable listener for the input.
     */
    _attachFieldListeners() {
        const handler = this._getSuitableListener();
        const listener = debounce(
            handler.listener.bind(this),
            this.el.dataset.delay || this.options.delay
        );

        if (~['radio', 'checkbox'].indexOf(this.el.type)) {
            this.vm.$once('validatorReady', () => {
                [...document.querySelectorAll(`input[name="${this.el.name}"]`)].forEach(input => {
                    input.addEventListener(handler.name, listener);
                    this.callbacks.push({
                        name: handler.name,
                        listener,
                        el: input
                    });
                });
            });

            return;
        }

        this.el.addEventListener(handler.name, listener);
        this.callbacks.push({ name: handler.name, listener, el: this.el });
    }

    /**
     * Attaches the Event Listeners.
     */
    attach() {
        this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);
        this._attachValidatorEvent();

        if (this.binding.expression) {
            return;
        }

        this._attachFieldListeners();
    }

    /**
     * Removes all attached event listeners.
     */
    detach() {
        this.callbacks.filter(({ name }) => name === DEFAULT_EVENT_NAME).forEach(h => {
            this.vm.$off(DEFAULT_EVENT_NAME, h.listener);
        });

        this.callbacks.filter(({ name }) => name !== DEFAULT_EVENT_NAME).forEach(h => {
            h.el.removeEventListener(h.name, h.listener);
        });
    }
}
