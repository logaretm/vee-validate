import debounce from './utils/debouncer.js';

const callbackMaps = [];

const DEFAULT_EVENT_NAME = 'veeValidate';

const getScope = (el) => el.dataset.scope || el.form.dataset.scope || undefined;

const onInput = (el, { expression }, { context }) => () => {
    context.$validator.validate(expression || el.name, el.value, getScope(el));
};

const onFileInput = (el, { modifiers, expression }, { context }) => () => {
    const isValid = context.$validator.validate(expression || el.name, el.files, getScope(el));
    if (! isValid && modifiers.reject) {
        // eslint-disable-next-line
        el.value = '';
    }
};

const hasFieldDependency = (rules) => {
    const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
    if (! results.length) {
        return false;
    }

    return results[0].split(':')[1];
};

const attachValidatorEvent = (el, { expression, value }, { context }) => {
    let callback;
    if (expression) {
        callback = () => (scope) => {
            if (scope) {
                if (getScope(el) === scope) {
                    context.$validator.validate(expression || el.name, value, getScope(el));
                }

                return;
            }

            context.$validator.validate(expression || el.name, value, getScope(el));
        };
    } else {
        callback = (scope) => {
            if (scope) {
                if (getScope(el) === scope) {
                    onInput(el, { expression }, { context })();
                }

                return;
            }

            onInput(el, { expression }, { context })();
        };
    }

    callbackMaps.push({ vm: context, event: 'validatorEvent', callback, el });
    context.$on(DEFAULT_EVENT_NAME, callback);

    const fieldName = hasFieldDependency(el.dataset.rules);
    if (el.dataset.rules && fieldName) {
        context.$once('validatorReady', () => {
            document.querySelector(`input[name='${fieldName}']`)
                    .addEventListener('input', callback);
        });
    }
};

export default (options) => ({
    bind(el, binding, { context }) {
        context.$validator.attach(binding.expression || el.name, el.dataset.rules, el.dataset.as);
        attachValidatorEvent(el, binding, { context });

        if (binding.expression) {
            // if its bound, validate it. (since update doesn't trigger after bind).
            if (! binding.modifiers.initial) {
                context.$validator.validate(binding.expression, binding.value, getScope(el));
            }

            return;
        }

        let handler = el.type === 'file' ? onFileInput(el, binding, { context }) :
        onInput(el, binding, { context });

        const delay = el.dataset.delay || options.delay;
        handler = delay ? debounce(handler, delay) : handler;
        const event = el.type === 'file' ? 'change' : 'input';
        el.addEventListener(event, handler);
        callbackMaps.push({ vm: context, event, callback: handler, el });
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value, getScope(el));
    },
    unbind(el, binding, { context }) {
        const handlers = callbackMaps.filter(h => h.vm === context && h.el === el);
        context.$off(
            DEFAULT_EVENT_NAME,
            handlers.filter(({ event }) => event === 'validatorEvent')[0]
        );

        handlers.filter(({ event }) => event !== 'validatorEvent').forEach(h => {
            el.removeEventListener(h.event, h.callback);
        });
    }
});
