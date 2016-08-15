import debounce from './utils/debouncer.js';

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

    context.$on(DEFAULT_EVENT_NAME, callback);
};

export default (options) => ({
    bind(el, binding, { context }) {
        context.$validator.attach(binding.expression || el.name, el.dataset.rules, el.dataset.as);

        if (binding.expression) {
            attachValidatorEvent(el, binding, { context });

            return;
        }

        let handler = el.type === 'file' ? onFileInput(el, binding, { context }) :
         onInput(el, {}, { context });

        const delay = el.dataset.delay || options.delay;
        handler = delay ? debounce(handler, delay) : handler;
        el.addEventListener(el.type === 'file' ? 'change' : 'input', handler);

        attachValidatorEvent(el, binding, { context });

        // if its bound, validate it (ensures consistant behavior with v1.x and inital modifier).
        if (binding.expression) {
            context.$validator.validate(binding.expression, binding.value);
        }
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        if (modifiers.initial && ! el.dataset.initial) {
            // eslint-disable-next-line
            el.dataset.initial = 'updated';

            return;
        }

        context.$validator.validate(expression || el.name, value);
    }
});
