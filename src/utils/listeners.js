import warn from './warn';
import debounce from './debouncer';
import { getScope } from './helpers';

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

const _attachValidatorEvent = (el, { expression, value }, { context }) => {
    const elScope = getScope(el);

    const callback = elScope ? (scope) => {
        // only validate when they have the same scope.
        if (scope === elScope) {
            _onInput(el, { expression }, { context })();
        }
    } : _onInput(el, { expression }, { context });

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
const _getSuitableListener = (el, binding, { context }) => {
    if (el.type === 'file') {
        return {
            name: 'change',
            listener: _onFileChanged(el, binding, { context })
        };
    }

    return {
        name: 'input',
        listener: _onInput(el, binding, { context })
    };
};

/**
 * Attachs a suitable listener for the input.
 */
const _attachFieldListeners = (el, binding, { context }, options) => {
    const handler = _getSuitableListener(el, binding, { context });
    const delay = el.dataset.delay || options.delay;
    const listener = delay ? debounce(handler.listener, delay) : handler.listener;
    el.addEventListener(handler.name, listener);
    callbackMaps.push({ vm: context, event, callback: listener, el });
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
        handlers.filter(({ event }) => event === 'validatorEvent')[0]
    );

    handlers.filter(({ event }) => event !== 'validatorEvent').forEach(e => {
        el.removeEventListener(e.event, e.callback);
    });
};

export default { attach, detach };
