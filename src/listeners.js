import { getScope, debounce, warn, getDataAttribute, isObject } from './utils/helpers';

export default class ListenerGenerator
{
    constructor(el, binding, vnode, options) {
        this.unwatch = undefined;
        this.callbacks = [];
        this.el = el;
        this.scope = isObject(binding.value) ? binding.value.scope : getScope(el);
        this.binding = binding;
        this.vm = vnode.context;
        this.component = vnode.child;
        this.options = options;
        this.fieldName = this._resolveFieldName();
    }

    /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
    _resolveFieldName() {
        if (this.component) {
            return getDataAttribute(this.el, 'name') || this.component.name;
        }

        return this.el.name || getDataAttribute(this.el, 'name');
    }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */
    _hasFieldDependency(rules) {
        let fieldName = false;
        if (! rules) {
            return false;
        }

        if (isObject(rules)) {
            Object.keys(rules).forEach(r => {
                if (/confirmed|after|before/.test(r)) {
                    fieldName = rules[r];

                    return false;
                }
            });

            return fieldName;
        }

        rules.split('|').every(r => {
            if (/\b(confirmed|after|before):/.test(r)) {
                fieldName = r.split(':')[1];
                return false;
            }

            if (/\b(confirmed)/.test(r)) {
                fieldName = `${this.fieldName}_confirmation`;
                return false;
            }

            return true;
        });

        return fieldName;
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
        const isValid = this._validate(Array.from(this.el.files));

        if (! isValid && this.binding.modifiers.reject) {
            this.el.value = '';
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

        Array.from(checkedBoxes).forEach(box => {
            this._validate(box.value);
        });
    }

    /**
     * Trigger the validation for a specific value.
     */
    _validate(value) {
        return this.vm.$validator.validate(this.fieldName, value, this.scope || getScope(this.el));
    }

    /**
     * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
     * From the event.
     */
    _getScopedListener(callback) {
        return (scope) => {
            if (! scope || scope === this.scope || scope instanceof Event) {
                callback();
            }
        };
    }

    _getRules() {
        if (! this.binding.expression) {
            return getDataAttribute(this.el, 'rules');
        }

        return isObject(this.binding.value) ? this.binding.value.rules : this.binding.value;
    }

    /**
     * Attaches validator event-triggered validation.
     */
    _attachValidatorEvent() {
        const listener = this._getScopedListener(this._getSuitableListener().listener.bind(this));
        const fieldName = this._hasFieldDependency(this._getRules());
        if (fieldName) {
            // Wait for the validator ready triggered when vm is mounted because maybe
            // the element isn't mounted yet.
            this.vm.$nextTick(() => {
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

        if (this.el.tagName === 'SELECT') {
            return {
                names: ['change', 'blur'],
                listener: this._inputListener
            };
        }

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
        const events = getDataAttribute(this.el, 'validate-on');
        if (events) {
            listener.names = events.split('|');
        }

        return listener;
    }

    /**
     * Attaches neccessary validation events for the component.
     */
    _attachComponentListeners() {
        this.componentListener = debounce((value) => {
            this._validate(value);
        }, getDataAttribute(this.el, 'delay') || this.options.delay);

        this.component.$on('input', this.componentListener);
    }

    /**
     * Attachs a suitable listener for the input.
     */
    _attachFieldListeners() {
        // If it is a component, use vue events instead.
        if (this.component) {
            this._attachComponentListeners();

            return;
        }

        const handler = this._getSuitableListener();
        const listener = debounce(
            handler.listener.bind(this),
            getDataAttribute(this.el, 'delay') || this.options.delay
        );

        if (~['radio', 'checkbox'].indexOf(this.el.type)) {
            this.vm.$nextTick(() => {
                const elms = document.querySelectorAll(`input[name="${this.el.name}"]`);
                Array.from(elms).forEach(input => {
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
     * Returns a context, getter factory pairs for each input type.
     */
    _resolveValueGetter() {
        if (this.component) {
            return {
                context: () => this.component,
                getter(context) {
                    return context[getDataAttribute(context.$el, 'value-path')] || context.value;
                }
            };
        }

        switch (this.el.type) {
        case 'checkbox': return {
            context: () => document.querySelectorAll(`input[name="${this.el.name}"]:checked`),
            getter(context) {
                if (! context || ! context.length) {
                    return null;
                }

                return Array.from(context).map(checkbox => checkbox.value);
            }
        };
        case 'radio': return {
            context: () => document.querySelector(`input[name="${this.el.name}"]:checked`),
            getter(context) {
                return context && context.value;
            }
        };
        case 'file': return {
            context: () => this.el,
            getter(context) {
                return Array.from(context.files);
            }
        };

        default: return {
            context: () => this.el,
            getter(context) {
                return context.value;
            }
        };
        }
    }

    /*
    * Gets the arg string value, either from the directive or the expression value.
    */
    _getArg() {
        if (this.binding.arg) {
            return this.binding.arg;
        }

        return isObject(this.binding.value) ? this.binding.value.arg : null;
    }

    /**
     * Attaches the Event Listeners.
     */
    attach() {
        const { context, getter } = this._resolveValueGetter();
        this.vm.$validator.attach(this.fieldName, this._getRules(), {
            scope: () => {
                return this.scope || getScope(this.el);
            },
            prettyName: getDataAttribute(this.el, 'as'),
            context,
            getter,
            listeners: this
        });

        this._attachValidatorEvent();
        const arg = this._getArg();
        if (arg) {
            this.unwatch = this.vm.$watch(arg, (value) => {
                this.vm.$validator.validate(this.fieldName, value, this.scope || getScope(this.el));
            });

            return;
        }

        this._attachFieldListeners();
    }

    /**
     * Removes all attached event listeners.
     */
    detach() {
        if (this.component) {
            this.component.$off('input', this.componentListener);
        }

        if (this.unwatch) {
            this.unwatch();
        }

        this.callbacks.forEach(h => {
            h.el.removeEventListener(h.name, h.listener);
        });
    }
}
