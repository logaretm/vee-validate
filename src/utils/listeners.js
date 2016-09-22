import { getScope, debounce, warn } from './helpers';

/**
 * Holds default name for the validator self-validation trigger name.
 * @type {String}
 */
const DEFAULT_EVENT_NAME = 'veeValidate';

/**
 * Keeps track of attached callbacks.
 * @type {Array}
 */
const callbackMaps = [];

/**
 * Determines if the validation rule requires additional listeners on target fields.
 */
const _hasFieldDependency = (rules) => {
    const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
    if (! results.length) {
        return false;
    }

    return results[0].split(':')[1];
};

/**
 * Validates input value, triggered by 'input' event.
 */
const _onInput = (el, { expression }, { context }) => () => {
    context.$validator.validate(expression || el.name, el.value, getScope(el));
};

/**
 * Validates files, triggered by 'change' event.
 */
const _onFileChanged = (el, { modifiers, expression }, { context }) => () => {
    const isValid = context.$validator.validate(expression || el.name, el.files, getScope(el));
    if (! isValid && modifiers.reject) {
        // eslint-disable-next-line
        el.value = '';
    }
};

/**
 * Validates radio buttons, triggered by 'change' event.
 */
const _onChange = (el, { expression }, { context }) => () => {
    const checked = document.querySelector(`input[name="${el.name}"]:checked`);
    if (! checked) {
        context.$validator.validate(expression || el.name, null, getScope(el));
        return;
    }

    context.$validator.validate(expression || el.name, checked.value, getScope(el));
};

/**
 * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
 * From the event.
 */
const _getScopedListener = (elScope, callback) => {
    if (elScope) {
        return (scope) => {
            if (scope === elScope) {
                callback();
            }
        };
    }

    return callback;
};

const _attachValidatorEvent = (el, { expression, value }, { context }) => {
    const callback = _getScopedListener(
        getScope(el),
        (el.type === 'radio' ? _onChange : _onInput)(el, { expression }, { context })
    );

    callbackMaps.push({ vm: context, event: 'validatorEvent', callback, el });
    context.$on(DEFAULT_EVENT_NAME, callback);

    const fieldName = _hasFieldDependency(el.dataset.rules);
    if (fieldName) {
        // Wait for the validator ready triggered when vm is mounted because maybe
        // the element isn't mounted yet.
        context.$once('validatorReady', () => {
            const target = document.querySelector(`input[name='${fieldName}']`);
            if (! target) {
                warn('Cannot find target field, no additional listeners were attached.');
                return;
            }

            target.addEventListener('input', callback);
            callbackMaps.push({ vm: context, event: 'fieldDependency', callback, el: target });
        });
    }
};

/**
 * Finds the suitable listener for the input type.
 */
const _getSuitableListener = (el, binding, vnode) => {
    if (el.type === 'file') {
        return {
            name: 'change',
            listener: _onFileChanged(el, binding, vnode)
        };
    }

    if (el.type === 'radio') {
        return {
            name: 'change',
            listener: _onChange(el, binding, vnode)
        };
    }

    return {
        name: 'input',
        listener: _onInput(el, binding, vnode)
    };
};

/**
 * Attachs a suitable listener for the input.
 */
const _attachFieldListeners = (el, binding, { context }, options) => {
    const handler = _getSuitableListener(el, binding, { context });
    const listener = debounce(handler.listener, el.dataset.delay || options.delay);

    if (el.type === 'radio') {
        context.$once('validatorReady', () => {
            document.querySelectorAll(`input[name="${el.name}"]`).forEach(input => {
                input.addEventListener(handler.name, listener);
                callbackMaps.push({
                    vm: context,
                    event: handler.name,
                    callback: listener,
                    el: input
                });
            });
        });

        return;
    }

    el.addEventListener(handler.name, listener);
    callbackMaps.push({ vm: context, event: handler.name, callback: listener, el });
};

/**
 * Attaches the required events, and any additional listeners.
 */
const attach = (el, binding, vnode, options) => {
    vnode.context.$validator.attach(binding.expression || el.name, el.dataset.rules, el.dataset.as);
    _attachValidatorEvent(el, binding, vnode);

    if (binding.expression) {
        // if its bound, validate it. (since update doesn't trigger after bind).
        if (! binding.modifiers.initial) {
            vnode.context.$validator.validate(binding.expression, binding.value, getScope(el));
        }

        return;
    }

    _attachFieldListeners(el, binding, vnode, options);
};

/**
 * Removes all event listeners.
 */
const detach = (el, context) => {
    const handlers = callbackMaps.filter(h => h.vm === context && h.el === el);
    context.$off(
        DEFAULT_EVENT_NAME,
        handlers.filter(({ event }) => event === DEFAULT_EVENT_NAME)[0]
    );

    handlers.filter(({ event }) => event !== DEFAULT_EVENT_NAME).forEach(h => {
        h.el.removeEventListener(h.event, h.callback);
    });
};

export default { attach, detach };
