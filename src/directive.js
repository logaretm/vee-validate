import debounce from './utils/debouncer.js';

const callbackMaps = [];

const DEFAULT_EVENT_NAME = 'veeValidate';

const onInput = (el, { expression }, { context }) => () => {
    context.$validator.validate(expression || el.name, el.value);
};

const onFileInput = (el, { modifiers, expression }, { context }) => () => {
    if (! context.$validator.validate(expression || el.name, el.files) && modifiers.reject) {
        // eslint-disable-next-line
        el.value = '';
    }
};

const attachValidatorEvent = (el, { expression, value }, { context }) => {
    let callback;
    if (expression) {
        callback = onInput(el, { expression }, { context });
    } else {
        callback = () => context.$validator.validate(expression || el.name, value);
    }

    callbackMaps.push({ vm: context, event: 'validatorEvent', callback, el });
    context.$on(DEFAULT_EVENT_NAME, callback);
};

export default (options) => ({
    bind(el, binding, { context }) {
        context.$validator.attach(binding.expression || el.name, el.dataset.rules, el.dataset.as);
        attachValidatorEvent(el, binding, { context });

        if (binding.expression && ! binding.modifiers.initial) {
            // if its bound, validate it. (since update doesn't trigger after bind).
            context.$validator.validate(binding.expression, binding.value);

            return;
        }

        let handler = el.type === 'file' ? onFileInput(el, binding, { context }) :
        onInput(el, {}, { context });

        const delay = el.dataset.delay || options.delay;
        handler = delay ? debounce(handler, delay) : handler;
        const event = el.type === 'file' ? 'change' : 'input';
        el.addEventListener(event, handler);
        callbackMaps.push({ vm: context, event, callback: handler, el });

        // confirmed requires another listener on the target field.
        // TODO: Clean this up.
        if (el.dataset.rules && ~el.dataset.rules.indexOf('confirmed')) {
            const fieldName = el.dataset.rules.split('|')
            .filter(r => !! ~r.indexOf('confirmed'))[0]
            .split(':')[1];

            context.$once('validatorReady', () => {
                document.querySelector(`input[name='${fieldName}']`)
                        .addEventListener('input', handler);
            });
        }
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value);
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
