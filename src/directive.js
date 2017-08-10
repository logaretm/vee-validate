import Generator from './generator';
import config from './config';
import { getDataAttribute, isEqual, getRules, warn, assign } from './utils';

/**
 * Finds the requested field by id from the context object.
 * @param {Object} context
 * @return {Field|null}
 */
const findField = (el, context) => {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: getDataAttribute(el, 'id') });
};

const createDirective = options => {
  options = assign({}, config, options);

  return {
    bind (el, binding, vnode) {
      const validator = vnode.context.$validator;
      if (! validator) {
        warn(`No validator instance is present on vm, did you forget to inject '$validator'?`);
        return;
      }
      const fieldOptions = Generator.generate(el, binding, vnode, options);
      validator.attach(fieldOptions);
    },
    inserted (el, binding, vnode) {
      const field = findField(el, vnode.context);
      if (!field) return;

      const scope = Generator.resolveScope(el, binding, vnode);
      field.update({ scope });
    },
    update (el, binding, vnode) {
      const field = findField(el, vnode.context);
      if (!field) return;
      // make sure we don't do uneccessary work if no change in expression.
      const scope = Generator.resolveScope(el, binding, vnode);
      if (scope === field.scope && isEqual(binding.value, binding.oldValue) && field.updated) return;

      field.update({
        scope,
        rules: getRules(binding, el)
      });
      field.updated = true;
    },
    unbind (el, binding, { context }) {
      const field = findField(el, context);
      if (!field) return;

      context.$validator.detach(field);
    }
  };
};

export default createDirective;
