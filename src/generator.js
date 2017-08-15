import { getScope, getDataAttribute, isObject, toArray, find, getPath, hasPath } from './utils';

/**
 * Generates the options required to construct a field.
 */
export default class Generator {
  static generate (el, binding, vnode, options = {}) {
    const model = Generator.resolveModel(binding, vnode);

    return {
      name: Generator.resolveName(el, vnode),
      el: el,
      listen: !binding.modifiers.disable,
      scope: Generator.resolveScope(el, binding, vnode),
      vm: Generator.makeVM(vnode.context),
      expression: binding.value,
      component: vnode.child,
      classes: options.classes,
      classNames: options.classNames,
      getter: Generator.resolveGetter(el, vnode, model),
      events: Generator.resolveEvents(el, vnode) || options.events,
      model,
      delay: Generator.resolveDelay(el, vnode, options),
      rules: Generator.resolveRules(el, binding),
      initial: !!binding.modifiers.initial,
      alias: Generator.resolveAlias(el, vnode),
      validity: options.validity,
      aria: options.aria
    };
  }

  /**
   * 
   * @param {*} el 
   * @param {*} binding 
   */
  static resolveRules (el, binding) {
    if (!binding || !binding.expression) {
      return getDataAttribute(el, 'rules');
    }

    if (typeof binding.value === 'string') {
      return binding.value;
    }

    if (~['string', 'object'].indexOf(typeof binding.value.rules)) {
      return binding.value.rules;
    }

    return binding.value;
  }

  /**
   * Creates a non-circular partial VM instance from a Vue instance.
   * @param {*} vm 
   */
  static makeVM (vm) {
    return {
      get $el () {
        return vm.$el;
      },
      get $refs () {
        return vm.$refs;
      },
      $watch: vm.$watch ? vm.$watch.bind(vm) : () => {},
      $validator: vm.$validator ? {
        errors: vm.$validator.errors,
        validate: vm.$validator.validate.bind(vm.$validator)
      } : null
    };
  }

  /**
   * Resolves the delay value.
   * @param {*} el
   * @param {*} vnode
   * @param {Object} options
   */
  static resolveDelay (el, vnode, options = {}) {
    return getDataAttribute(el, 'delay') || (vnode.child && vnode.child.$attrs && vnode.child.$attrs['data-vv-delay']) || options.delay;
  }

  /**
   * Resolves the alias for the field.
   * @param {*} el 
   * @param {*} vnode 
   */
  static resolveAlias (el, vnode) {
    return getDataAttribute(el, 'as') || (vnode.child && vnode.child.$attrs && vnode.child.$attrs['data-vv-as']) || el.title || null;
  }

  /**
   * Resolves the events to validate in response to.
   * @param {*} el
   * @param {*} vnode
   */
  static resolveEvents (el, vnode) {
    if (vnode.child) {
      return getDataAttribute(el, 'validate-on') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-validate-on']);
    }

    return getDataAttribute(el, 'validate-on');
  }

  /**
   * Resolves the scope for the field.
   * @param {*} el
   * @param {*} binding
   */
  static resolveScope (el, binding, vnode = {}) {
    let scope = null;
    if (isObject(binding.value)) {
      scope = binding.value.scope;
    }

    if (vnode.child && !scope) {
      scope = vnode.child.$attrs && vnode.child.$attrs['data-vv-scope'];
    }

    return scope || getScope(el);
  }

  /**
   * Checks if the node directives contains a v-model or a specified arg.
   * Args take priority over models.
   *
   * @return {Object}
   */
  static resolveModel (binding, vnode) {
    if (binding.arg) {
      return binding.arg;
    }

    if (isObject(binding.value) && binding.value.arg) {
      return binding.value.arg;
    }

    const model = vnode.data.model || find(vnode.data.directives, d => d.name === 'model');
    if (!model) {
      return null;
    }

    const watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) && hasPath(model.expression, vnode.context);

    if (!watchable) {
      return null;
    }

    return model.expression;
  }

  /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
  static resolveName (el, vnode) {
    if (vnode.child) {
      return getDataAttribute(el, 'name') || (vnode.child.$attrs && (vnode.child.$attrs['data-vv-name'] || vnode.child.$attrs['name'])) || vnode.child.name;
    }

    return getDataAttribute(el, 'name') || el.name;
  }

  /**
   * Returns a value getter input type.
   */
  static resolveGetter (el, vnode, model) {
    if (model) {
      return () => {
        return getPath(model, vnode.context);
      };
    }

    if (vnode.child) {
      return () => {
        const path = getDataAttribute(el, 'value-path') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-value-path']);
        if (path) {
          return getPath(path, vnode.child);
        }
        return vnode.child.value;
      };
    }

    switch (el.type) {
    case 'checkbox': return () => {
      let els = document.querySelectorAll(`input[name="${el.name}"]`);

      els = toArray(els).filter(el => el.checked);
      if (!els.length) return undefined;

      return els.map(checkbox => checkbox.value);
    };
    case 'radio': return () => {
      const els = document.querySelectorAll(`input[name="${el.name}"]`);
      const elm = find(els, el => el.checked);

      return elm && elm.value;
    };
    case 'file': return (context) => {
      return toArray(el.files);
    };
    case 'select-multiple': return () => {
      return toArray(el.options).filter(opt => opt.selected).map(opt => opt.value);
    };
    default: return () => {
      return el && el.value;
    };
    }
  }
}
