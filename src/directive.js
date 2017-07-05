import Generator from './generator';
import { getDataAttribute, isObject, getRules, warn, getScope } from './utils';

/**
 * Finds the requested field by id from the context object.
 * @param {Object} context
 */
const findField = (context) => {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: getDataAttribute('id') });
};

export default (options) => ({
  bind (el, binding, vnode) {
    const validator = vnode.context.$validator;
    if (! validator) {
      const name = vnode.context.$options._componentTag;
      // eslint-disable-next-line
      warn(`No validator instance is present on ${name ?'component "' +  name + '"' : 'un-named component'}, did you forget to inject '$validator'?`);
      return;
    }
    const fieldOptions = Generator.generate(el, binding, vnode, options);
    validator.attach(fieldOptions);
  },
  inserted (el, { value, expression }, { context }) {
    const field = findField(context);
    if (!field) return;

    let scope = isObject(value) ? (value.scope || getScope(el)) : getScope(el);
    if (!scope) {
      scope = '__global__';
    }

    field.update({ scope });
  },
  update (el, { expression, value }, { context }) {
    const field = findField(context);
    // make sure we don't do uneccessary work if no expression was passed
    // nor if the expression value did not change.
    if (!field || !expression || (field.expression === JSON.stringify(value))) return;

    field.expression = JSON.stringify(value);
    const scope = isObject(value) ? (value.scope || getScope(el)) : getScope(el);
    field.update({
      rules: getRules(expression, value, el),
      scope: scope || '__global__'
    });
  },
  unbind (el, { value }, { context }) {
    const field = findField(context);
    if (!field) return;

    context.$validator.fields.remove({ id: field.id });
    field.destroy();
  }
});
