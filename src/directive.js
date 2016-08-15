import debounce from './utils/debouncer.js';

const DEFAULT_EVENT_NAME = 'veeValidate';

const onInput = (el, binding, { context }) => () => {
    context.$validator.validate(name, el.value);
};

const onFileInput = (el, { modifiers }, { context }) => () => {
    if (! context.$validator.validate(name, el.files) && modifiers.reject) {
        // eslint-disable-next-line
        el.value = '';
    }
};

const attachValidatorEvent = (el, binding, vnode) => {
    let callback;
    if (binding.expression) {
        callback = onInput(el, binding, vnode);
    } else {
        callback = () => vnode.context.$validator.validate(name, binding.value);
    }

    vnode.context.$on(DEFAULT_EVENT_NAME, callback);
};

export default (options) => ({
    bind(el, { expression, modifiers }, vnode) {
        const name = expression || el.name;
        this.vm.$validator.attach(name, el.dataset.rules, el.dataset.as);

        if (expression) {
            attachValidatorEvent(el, { expression }, vnode);

            return;
        }

        let handler = el.type === 'file' ? onFileInput(el, { modifiers }, vnode) :
         onInput(el, {}, vnode);

        const delay = el.dataset.delay || options.delay;
        handler = delay ? debounce(handler, delay) : handler;
        this.el.addEventListener(el.type === 'file' ? 'change' : 'input', handler);

        this.attachValidatorEvent();
    },
    update(el, { expression, value, modifiers }, { context }) {
        if (! expression) {
            return;
        }

        if (modifiers.initial) {
            // eslint-disable-next-line
            modifiers.initial = false;

            return;
        }

        context.$validator.validate(expression || el.name, value);
    }
});
