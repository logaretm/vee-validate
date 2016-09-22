/* eslint-disable no-param-reassign, no-underscore-dangle */
import { getScope, debounce, warn } from './helpers';

const DEFAULT_EVENT_NAME = 'veeValidate';

/**
 * Holds references to the listeners.
 * @type {Array}
 */
const callbackMaps = [];

/**
 * Determines if the validation rules require additional listeners on target fields.
 */
const _hasFieldDependency = (rules) => {
    const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
    if (! results.length) {
        return false;
    }

    return results[0].split(':')[1];
};

/**
 * Validates input value, triggered by input event.
 */
const _onInput = (context) => () => {
    context.vm.$validator.validate(context.fieldName, context.el.value, getScope(context.el));
};

/**
 * Validates files, triggered by change event.
 */
const _onFileChanged = (context) => () => {
    if (! context.vm.$validator.validate(context.fieldName, context.el.files, getScope(context.el))
    && context.modifiers.reject) {
        context.el.value = '';
    }
};

/**
 * Validates radio buttons, triggered by change.
 */
const _onChange = (context) => () => {
    const el = document.querySelector(`input[name="${context.fieldName}"]:checked`);
    context.vm.$validator.validate(context.fieldName, el.value, getScope(el));
};

/**
 * Returns a suitable listener for the specified context element.
 */
const _getSuitableListener = (context) => {
    if (context.el.type === 'file') {
        return {
            name: 'change',
            listener: _onFileChanged(context)
        };
    }

    if (context.el.type === 'radio') {
        return {
            name: 'change',
            listener: _onChange(context)
        };
    }

    return {
        name: 'input',
        listener: _onInput(context)
    };
};

/**
 * Attaches the validator event listener.
 */
const _attachValidatorEvent = (context) => {
    const elScope = getScope(context.el);
    let callback = elScope ? (scope) => {
        if (scope === elScope) {
            _onInput(context)();
        }
    } : _onInput(context);

    if (context.el.type === 'radio') {
        callback = () => {
            const el = document.querySelector(`input[name="${context.el.name}"]:checked`);
            if (! el) {
                context.vm.$validator.validate(context.fieldName, null, elScope);
                return;
            }

            context.vm.$validator.validate(context.fieldName, el.value, elScope);
        };
    }

    context.vm.$on(DEFAULT_EVENT_NAME, callback);
    callbackMaps.push({ context, event: DEFAULT_EVENT_NAME, callback });

    const fieldName = _hasFieldDependency(context.el.dataset.rules);
    if (fieldName) {
        context.vm.$once('validatorReady', () => {
            const target = document.querySelector(`input[name='${fieldName}']`);
            if (! target) {
                warn('Cannot find the target field, additional listeners were not attached');
                return;
            }
            const listener = () => {
                context.vm.$validator.validate(context.fieldName, context.el.value, elScope);
            };
            target.addEventListener('input', listener);
            callbackMaps.push({ context, event: 'input', el: target, callback: listener });
        });
    }
};

const _attachFieldEvent = (context, name, listener) => {
    if (context.el.type === 'radio') {
        document.querySelectorAll(`input[name="${context.fieldName}"]`).forEach(el => {
            el.addEventListener(name, listener);
            callbackMaps.push({ context, event: name, callback: listener, el });
        });

        return;
    }

    context.el.addEventListener(name, listener);
    callbackMaps.push({ context, event: name, callback: listener, el: context.el });
};

/**
 * Attaches required event listeners.
 */
const attach = (context, options) => {
    context.vm.$nextTick(() => {
        context.fieldName = context.expression || context.el.name;
        context.vm.$validator.attach(
            context.fieldName,
            context.el.dataset.rules,
            context.el.dataset.as
        );

        _attachValidatorEvent(context);

        if (context.expression) {
            return;
        }

        const handler = _getSuitableListener(context);
        const listener = debounce(
            handler.listener.bind(context),
            context.el.dataset.delay || options.delay
        );

        _attachFieldEvent(context, handler.name, listener);
    });
};

/**
 * Removes all event listeners.
 */
const detach = (context) => {
    // All listeners registered by this directive.
    const handlers = callbackMaps.filter(c => context === c.context);
    const validatorListener = handlers.filter(({ event }) => event === DEFAULT_EVENT_NAME)[0];
    context.vm.$off(DEFAULT_EVENT_NAME, validatorListener.callback);

    handlers.filter(({ event }) => event !== DEFAULT_EVENT_NAME).forEach(h => {
        h.el.removeEventListener(h.event, h.callback);
    });
};

export default { attach, detach };
