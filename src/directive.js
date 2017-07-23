import Generator from './generator';
import config from './config';
import { getDataAttribute, isObject, getRules, warn, getScope, assign } from './utils';

/**
 * Finds the requested field by id from the context object.
 * @param {Object} context
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
    inserted (el, { value, expression }, { context }) {
      const field = findField(el, context);
      if (!field) return;

      const scope = isObject(value) && value.rules ? value.scope : getScope(el);
      field.update({ scope });
    },
    update (el, { expression, value }, { context }) {
      const field = findField(el, context);
      // make sure we don't do uneccessary work if no expression was passed
      // nor if the expression value did not change.
      // TODO: Diffing for other options like delay or scope.
      if (!field || !expression || field.expression === JSON.stringify(value)) return;

      const scope = isObject(value) && value.rules ? value.scope : getScope(el);
      field.update({
        expression: value,
        scope,
        rules: getRules({ expression, value }, el)
      });
    },
    unbind (el, binding, { context }) {
      const field = findField(el, context);
      if (!field) return;

      context.$validator.detach(field);
    }
  };
};

export default createDirective;
