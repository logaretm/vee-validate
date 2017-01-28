import ListenerGenerator from '../listeners';
import { getScope, isObject, addClass, removeClass } from '../utils/helpers';

const listenersInstances = [];

const defaultClassNames = {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
};

function addClasses(el, fieldName, fields, classNames = null) {
    if (!fieldName) {
        return;
    }

    classNames = Object.assign({}, defaultClassNames, classNames);

    const isDirty = fields.dirty(fieldName);
    const isValid = fields.valid(fieldName);

    if (isDirty) {
        addClass(el, classNames.touched);
        removeClass(el, classNames.untouched);
    } else {
        addClass(el, classNames.untouched);
        removeClass(el, classNames.touched);
    }

    if (isValid) {
        addClass(el, classNames.valid);
        removeClass(el, classNames.invalid);
    } else {
        addClass(el, classNames.invalid);
        removeClass(el, classNames.valid);
    }
}

function setDirty(el, classNames) {
    classNames = Object.assign({}, defaultClassNames, classNames);

    addClass(el, classNames.dirty);
    removeClass(el, classNames.pristine);
}

function setPristine(el, classNames) {
    classNames = Object.assign({}, defaultClassNames, classNames);

    addClass(el, classNames.pristine);
    removeClass(el, classNames.dirty);
}

export default (options) => ({
    bind(el, binding, vnode) {
        const listener = new ListenerGenerator(el, binding, vnode, options);

        listener.attach();
        listenersInstances.push({ vm: vnode.context, el, instance: listener });

        if (options.enableAutoClasses) {
            const classNames = options.classNames;

            setPristine(el, classNames);

            el.onfocus = () => {
                setDirty(el, classNames);
            };

            addClasses(el, listener.fieldName, vnode.context.fields, classNames);
        }
    },
    update(el, { expression, value, oldValue }, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];

        if (options.enableAutoClasses) {
            addClasses(el, holder.instance.fieldName, context.fields, options.classNames);
        }

        // make sure we don't do uneccessary work if no expression was passed
        // or if the string value did not change.
        // eslint-disable-next-line
        if (! expression || (typeof value === 'string' && typeof oldValue === 'string' && value === oldValue)) return;

        const scope = isObject(value) ? (value.scope || getScope(el)) : getScope(el);
        context.$validator.updateField(
            holder.instance.fieldName,
            isObject(value) ? value.rules : value,
            { scope: scope || '__global__' }
        );
    },
    unbind(el, { value }, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        if (typeof holder === 'undefined') {
            return;
        }

        const scope = isObject(value) ? value.scope : getScope(el);
        context.$validator.detach(holder.instance.fieldName, scope);
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});
