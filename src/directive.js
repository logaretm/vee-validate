import ListenerGenerator from './listeners';
import { getScope, isObject, addClass, removeClass, find, getRules } from './utils';

const listenersInstances = [];

function addClasses(el, flags, classNames) {
  if (! flags) return;

  if (flags.dirty) {
    addClass(el, classNames.touched);
    removeClass(el, classNames.untouched);
  } else {
    addClass(el, classNames.untouched);
    removeClass(el, classNames.touched);
  }

  if (flags.valid || flags.passed) {
    addClass(el, classNames.valid);
    removeClass(el, classNames.invalid);
  } else {
    addClass(el, classNames.invalid);
    removeClass(el, classNames.valid);
  }
}

function setDirty(el, classNames) {
  addClass(el, classNames.dirty);
  removeClass(el, classNames.pristine);
}

function setPristine(el, classNames) {
  addClass(el, classNames.pristine);
  removeClass(el, classNames.dirty);
}

export default (options) => ({
  bind(el, binding, vnode) {
    const listener = new ListenerGenerator(el, binding, vnode, options);

    listener.attach();
    listenersInstances.push({ vm: vnode.context, el, instance: listener });

    if (options.enableAutoClasses) {
      setPristine(el, options.classNames);
      el.onfocus = () => { setDirty(el, options.classNames); };
      addClasses(
        el,
        vnode.context.$validator.fieldBag.fields[listener.fieldName],
        options.classNames
      );
    }
  },
  update(el, { expression, value, oldValue }, { context }) {
    const { instance } = find(listenersInstances, l => l.vm === context && l.el === el);
    if (options.enableAutoClasses) {
      addClasses(el, context.$validator.fieldBag.fields[instance.fieldName], options.classNames);
    }

    // make sure we don't do uneccessary work if no expression was passed
    // or if the string value did not change.
    // eslint-disable-next-line
    if (! expression || (typeof value === 'string' && typeof oldValue === 'string' && value === oldValue)) return;

    const scope = isObject(value) ? (value.scope || getScope(el)) : getScope(el);
    context.$validator.updateField(
      instance.fieldName,
      getRules(expression, value, el),
      { scope: scope || '__global__' }
    );
  },
  unbind(el, { value }, { context }) {
    const holder = find(listenersInstances, l => l.vm === context && l.el === el);
    if (typeof holder === 'undefined') {
      return;
    }

    const scope = isObject(value) ? value.scope : getScope(el);
    context.$validator.detach(holder.instance.fieldName, scope);
    listenersInstances.splice(listenersInstances.indexOf(holder), 1);
  }
});
