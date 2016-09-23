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
        const isValid = this.vm.$validator.validate(this.fieldName, this.el.files, getScope(this.el));
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
        const listener = this._getScopedListener(
            this.el.type === 'radio' ? this._radioListener.bind(this) :
                                       this._inputListener.bind(this)
        );

        this.vm.$on(DEFAULT_EVENT_NAME, listener);
        this.callbacks.push({ event: DEFAULT_EVENT_NAME, listener });

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
                this.callbacks.push({ event: 'input', listener, el: target });
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

        if (this.el.type === 'radio') {
            this.vm.$once('validatorReady', () => {
                [...document.querySelectorAll(`input[name="${this.el.name}"]`)].forEach(input => {
                    input.addEventListener(handler.name, listener);
                    this.callbacks.push({ event: handler.name, callback: listener, el: input });
                });
            });

            return;
        }

        this.el.addEventListener(handler.name, listener);
        this.callbacks.push({ event: handler.name, callback: listener, el: this.el });
    }

    /**
     * Attaches the Event Listeners.
     */
    attach() {
        this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);
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
        this.vm.$off(
            DEFAULT_EVENT_NAME,
            this.callbacks.filter(({ event }) => event === DEFAULT_EVENT_NAME)[0]
        );

        this.callbacks.filter(({ event }) => event !== DEFAULT_EVENT_NAME).forEach(h => {
            h.el.removeEventListener(h.event, h.listener);
        });
    }
}
