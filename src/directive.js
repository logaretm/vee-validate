import Generator from './core/generator';
import Validator from './core/validator';
import Field from './core/field';
import config from './config';
import { getDataAttribute, isEqual, warn, assign } from './core/utils';

// @flow

type ValidatingVM = {
  $validator: Validator
};

/**
 * Finds the requested field by id from the context object.
 */
const findField = (el: HTMLElement, context: ValidatingVM): ?Field => {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: getDataAttribute(el, 'id') });
};

const createDirective = (options: Object) => {
  options = assign({}, config, options);

  return {
    bind (el: HTMLElement, binding, vnode) {
      const validator = vnode.context.$validator;
      if (! validator) {
        warn(`No validator instance is present on vm, did you forget to inject '$validator'?`);
        return;
      }
      const fieldOptions = Generator.generate(el, binding, vnode, options);
      validator.attach(fieldOptions);
    },
    inserted: (el: HTMLElement, binding, vnode) => {
      const field = findField(el, vnode.context);
      const scope = Generator.resolveScope(el, binding, vnode);

      // skip if scope hasn't changed.
      if (!field || scope === field.scope) return;

      // only update scope.
      field.update({ scope });

      // allows the field to re-evaluated once more in the update hook.
      field.updated = false;
    },
    update: (el: HTMLElement, binding, vnode) => {
      const field = findField(el, vnode.context);

      // make sure we don't do uneccessary work if no important change was done.
      if (!field || (field.updated && isEqual(binding.value, binding.oldValue))) return;
      const scope = Generator.resolveScope(el, binding, vnode);
      const rules = Generator.resolveRules(el, binding);

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
};

export default createDirective;
