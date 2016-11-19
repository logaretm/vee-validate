import { getScope, debounce, warn } from './utils/helpers';

const DEFAULT_EVENT_NAME = 'veeValidate';

export default class ListenerGenerator
{
    constructor(el, binding, vnode, options) {
        this.callbacks = [];
        this.el = el;
        this.binding = binding;
        this.vm = vnode.context;
        this.component = vnode.child;
        this.options = options;
        this.fieldName = binding.expression || el.name;
    }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */
    _hasFieldDependency(rules) {
        const results = rules.split('|').filter(r => !! r.match(/\b(confirmed|after|before):/));
        if (! results.length) {
            return false;
        }

        return results[0].split(':')[1];
    }

    /**
     * Validates input value, triggered by 'input' event.
     */
    _inputListener() {
        this._validate(this.el.value);
    }

    /**
     * Validates files, triggered by 'change' event.
     */
    _fileListener() {
        const isValid = this._validate(this.el.files);

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
        this._validate(checked ? checked.value : null);
    }

    /**
     * Validates checkboxes, triggered by change event.
     */
    _checkboxListener() {
        const checkedBoxes = document.querySelectorAll(`input[name="${this.el.name}"]:checked`);
        if (! checkedBoxes || ! checkedBoxes.length) {
            this._validate(null);
            return;
        }

        [...checkedBoxes].forEach(box => {
            this._validate(box.value);
        });
    }

    /**
     * Trigger the validation for a specific value.
     */
    _validate(value) {
        return this.vm.$validator.validate(this.fieldName, value, getScope(this.el));
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

        const fieldName = this._hasFieldDependency(this.el.dataset.vvRules);
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
        let listener;

        // determine the suitable listener and events to handle
        switch (this.el.type) {
        case 'file':
            listener = {
                names: ['change'],
                listener: this._fileListener
            };
            break;

        case 'radio':
            listener = {
                names: ['change'],
                listener: this._radioListener
            };
            break;

        case 'checkbox':
            listener = {
                names: ['change'],
                listener: this._checkboxListener
            };
            break;

        default:
            listener = {
                names: ['input', 'blur'],
                listener: this._inputListener
            };
            break;
        }

        // users are able to specify which events they want to validate on
        // pipe separated list of handler names to use
        if (this.el.dataset.vvValidateOn) {
            listener.names = this.el.dataset.vvValidateOn.split('|');
        }

        return listener;
    }

    /**
     * Attachs a suitable listener for the input.
     */
    _attachFieldListeners() {
        if (this.component) {
            this.component.$on('input', (value) => {
                console.log(`Gotcha: ${value}`, this.fieldName);
                this.vm.$validator.validate(this.fieldName, value);
            });

            return;
        }

        const handler = this._getSuitableListener();
        const listener = debounce(
            handler.listener.bind(this),
            this.el.dataset.vvDelay || this.options.delay
        );

        if (~['radio', 'checkbox'].indexOf(this.el.type)) {
            this.vm.$once('validatorReady', () => {
                [...document.querySelectorAll(`input[name="${this.el.name}"]`)].forEach(input => {
                    handler.names.forEach(handlerName => {
                        input.addEventListener(handlerName, listener);
                        this.callbacks.push({ name: handlerName, listener, el: input });
                    });
                });
            });

            return;
        }

        handler.names.forEach(handlerName => {
            this.el.addEventListener(handlerName, listener);
            this.callbacks.push({ name: handlerName, listener, el: this.el });
        });
    }

    /**
     * Attaches the Event Listeners.
     */
    attach() {
        this.vm.$validator.attach(this.fieldName, this.el.dataset.vvRules, this.el.dataset.vvAs);
        this._attachValidatorEvent();

        if (this.binding.expression) {
            // if its bound, validate it. (since update doesn't trigger after bind).
            if (! this.binding.modifiers.initial) {
                this.vm.$validator.validate(
                    this.binding.expression,
                    this.binding.value,
                    getScope(this.el)
                );
            }

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
