import ListenerGenerator from './listeners';
import { getScope, isObject, find, getRules, warn } from './utils';

const listenersInstances = [];

export default (options) => ({
  inserted(el, binding, vnode) {
    if (! vnode.context.$validator) {
      // eslint-disable-next-line
      warn(`No validator instance is present on this component ${vnode.context.$options.name}, did you forget to inject '$validator'?`);

      return;
    }
    const listener = new ListenerGenerator(el, binding, vnode, options);
    listener.attach();
    listenersInstances.push({ vm: vnode.context, el, instance: listener });
  },
  update(el, { expression, value }, { context }) {
    const { instance } = find(listenersInstances, l => l.vm === context && l.el === el);
    // make sure we don't do uneccessary work if no expression was passed
    // nor if the expression did not change.
    if (! expression || (instance.cachedExp === JSON.stringify(value))) return;

    instance.cachedExp = JSON.stringify(value);
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

    const scope = isObject(value) ? value.scope : (getScope(el) || '__global__');
    context.$validator.detach(holder.instance.fieldName, scope);
    listenersInstances.splice(listenersInstances.indexOf(holder), 1);
  }
});
