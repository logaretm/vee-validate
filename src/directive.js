import Resolver from './core/resolver';
import Field from './core/field';
import { isEqual, warn } from './utils';

// @flow

/**
 * Finds the requested field by id from the context object.
 */
function findField (el: HTMLElement, context: ValidatingVM): ?Field {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: el._veeValidateId });
};

export default {
  bind (el: HTMLElement, binding, vnode) {
    const validator = vnode.context.$validator;
    if (!validator) {
      if (process.env.NODE_ENV !== 'production') {
        warn(`No validator instance is present on vm, did you forget to inject '$validator'?`);
      }

      return;
    }

    const fieldOptions = Resolver.generate(el, binding, vnode);
    validator.attach(fieldOptions);
  },
  inserted (el: HTMLElement, binding, vnode) {
    const field = findField(el, vnode.context);
    const scope = Resolver.resolveScope(el, binding, vnode);

    // skip if scope hasn't changed.
    if (!field || scope === field.scope) return;

    // only update scope.
    field.update({ scope });

    // allows the field to re-evaluated once more in the update hook.
    field.updated = false;
  },
  update (el: HTMLElement, binding, vnode) {
    const field = findField(el, vnode.context);

    // make sure we don't do unneccasary work if no important change was done.
    if (!field || (field.updated && isEqual(binding.value, binding.oldValue))) return;
    const scope = Resolver.resolveScope(el, binding, vnode);
    const rules = Resolver.resolveRules(el, binding, vnode);

    field.update({
      scope,
      rules
    });
  },
  unbind (el: HTMLElement, binding, { context }) {
    const field = findField(el, context);
    if (!field) return;

    context.$validator.detach(field);
  }
};
