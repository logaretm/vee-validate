import {
  getScope, debounce,
  getDataAttribute, isObject, toArray,
  find, getRules, assign,
  getPath, hasPath
} from './utils';
import config from './config';

/**
 * Generates the options required to construct a field.
 */
export default class Generator {
  constructor (el, binding, vnode, options) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    this.options = assign({}, config, options);
    this.classes = {
      enabled: options.classes,
      classNames: options.classNames
    };
  }

  static generate (el, binding, vnode, options) {
    const generator = new Generator(el, binding, vnode, options);

    return generator.generate();
  }

  resolveScope () {
    return (isObject(this.binding.value) ? this.binding.value.scope : getScope(this.el)) || '__global__';
  }

  generate () {
    return {
      name: this.resolveFieldName(),
      el: this.el,
      scope: this.resolveScope(),
      vm: this.vnode.context,
      expression: this.binding.value,
      component: this.vnode.child,
      classes: this.classes.enabled,
      classNames: this.classes.classNames,
      listeners: this.listeners,
      getters: this.resolveGetters(),
      model: this.resolveModel(),
      rules: getRules(this.binding.expression, this.binding.value, this.el),
      initial: this.binding.modifiers.initial,
      invalidateFalse: !!(this.el && this.el.type === 'checkbox'),
      alias: getDataAttribute(this.el, 'as') || this.el.title,
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

    const watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) && hasPath(model.expression);

    return watchable ? model.expression : null;
  }

  /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
  resolveFieldName () {
    if (this.vnode.child) {
      return getDataAttribute(this.el, 'name') || this.vnode.child.name;
    }

    return getDataAttribute(this.el, 'name') || this.el.name;
  }

  /**
   * Determines if the validation rule requires additional listeners on target fields.
  */
  _hasFieldDependency (rules) {
    let fieldName = false;
    if (! rules) {
      return false;
    }

    if (isObject(rules)) {
      Object.keys(rules).forEach(r => { // eslint-disable-line
        if (/confirmed|after|before/.test(r)) {
          fieldName = rules[r].split(',')[0];

          return false;
        }
      });

      return fieldName;
    }

    rules.split('|').every(r => {
      if (/\b(confirmed|after|before):/.test(r)) {
        fieldName = r.split(':')[1];
        return false;
      }

      if (/\b(confirmed)/.test(r)) {
        fieldName = `${this.fieldName}_confirmation`;
        return false;
      }

      return true;
    });

    return fieldName;
  }

  /**
   * Returns a context, value factory pairs for each input type.
   */
  resolveGetters () {
    if (this.model.watchable) {
      return {
        context: () => this.vm,
        // eslint-disable-next-line
        value: (context) => { 
          return getPath(this.model.expression, context);
        }
      };
    }

    if (this.component) {
      return {
        context: () => this.component,
        getter: (context) => {
          const path = getDataAttribute(this.el, 'value-path') || (this.component.$attrs && this.component.$attrs['data-vv-value-path']);
          if (path) {
            return getPath(path, this.component);
          }
          return context.value;
        }
      };
    }

    switch (this.el.type) {
    case 'checkbox': return {
      context: () => document.querySelectorAll(`input[name="${this.el.name}"]:checked`),
      value (context) {
        if (!context || !context.length) {
          return null;
        }

        return toArray(context).map(checkbox => checkbox.value);
      }
    };
    case 'radio': return {
      context: () => document.querySelector(`input[name="${this.el.name}"]:checked`),
      value (context) {
        return context && context.value;
      }
    };
    case 'file': return {
      context: () => this.el,
      value (context) {
        return toArray(context.files);
      }
    };

    default: return {
      context: () => this.el,
      value (context) {
        return context.value;
      }
    };
    }
  }
}
