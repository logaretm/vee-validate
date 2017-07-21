import { getScope, getDataAttribute, isObject, toArray, find, getRules, assign, getPath, hasPath } from './utils';
import config from './config';

/**
 * Generates the options required to construct a field.
 */
export default class Generator {
  constructor (el, binding, vnode, options = {}) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    this.options = assign({}, config, options);
    this.classes = {
      enabled: !!options.classes,
      classNames: options.classNames
    };
  }

  static generate (el, binding, vnode, options) {
    const generator = new Generator(el, binding, vnode, options);

    return generator.generate();
  }

  resolveScope () {
    return (isObject(this.binding.value) ? this.binding.value.scope : getScope(this.el));
  }

  generate () {
    return {
      name: this.resolveName(),
      el: this.el,
      scope: this.resolveScope(),
      vm: this.vnode.context,
      expression: this.binding.value,
      component: this.vnode.child,
      classes: this.classes.enabled,
      classNames: this.classes.classNames,
      getter: this.resolveGetter(),
      model: this.resolveModel(),
      delay: getDataAttribute(this.el, 'delay') || (this.vnode.child && this.vnode.child.$attrs && this.vnode.child.$attrs['data-vv-delay']) || this.options.delay,
      rules: getRules(this.binding, this.el),
      initial: !!this.binding.modifiers.initial,
      invalidateFalse: !!(this.el && this.el.type === 'checkbox'),
      alias: getDataAttribute(this.el, 'as') || this.el.title || null,
    };
  }

  /**
   * Checks if the node directives contains a v-model or a specified arg.
   * Args take priority over models.
   *
   * @return {Object}
   */
  resolveModel () {
    if (this.binding.arg) {
      return this.binding.arg;
    }

    if (isObject(this.binding.value) && this.binding.value.arg) {
      return this.binding.value.arg;
    }

    const model = this.vnode.data.model || find(this.vnode.data.directives, d => d.name === 'model');
    if (!model) {
      return null;
    }

    const watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) && hasPath(model.expression, this.vnode.context);

    if (!watchable) {
      return null;
    }

    this.model = model.expression;
    return this.model;
  }

  /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
  resolveName () {
    if (this.vnode.child) {
      return getDataAttribute(this.el, 'name') || (this.vnode.child.$attrs && this.vnode.child.$attrs['data-vv-name']) || this.vnode.child.name;
    }

    return getDataAttribute(this.el, 'name') || this.el.name;
  }

  /**
   * Returns a value getter input type.
   */
  resolveGetter () {
    if (this.model) {
      return () => {
        return getPath(this.model, this.vnode.context);
      };
    }

    if (this.vnode.child) {
      return () => {
        const path = getDataAttribute(this.el, 'value-path') || (this.vnode.child.$attrs && this.vnode.child.$attrs['data-vv-value-path']);
        if (path) {
          return getPath(path, this.vnode.child);
        }
        return this.vnode.child.value;
      };
    }

    switch (this.el.type) {
    case 'checkbox': return () => {
      let els = document.querySelectorAll(`input[name="${this.el.name}"]`);

      els = toArray(els).filter(el => el.checked);
      if (!els.length) return undefined;

      return els.map(checkbox => checkbox.value);
    };
    case 'radio': return () => {
      const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
      const el = find(els, el => el.checked);

      return el && el.value;
    };
    case 'file': return (context) => {
      return toArray(this.el.files);
    };
    case 'select-multiple': return () => {
      return toArray(this.el.options).filter(opt => opt.selected).map(opt => opt.value);
    };
    default: return () => {
      return this.el.value;
    };
    }
  }
}
