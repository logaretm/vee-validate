import Config from '../config';
import {
  getScope,
  getDataAttribute,
  isObject,
  toArray,
  find,
  getPath,
  hasPath,
  isNullOrUndefined,
  isCallable,
  deepParseInt,
} from './utils';

/**
 * Generates the options required to construct a field.
 */
export default class Generator {
  static generate (el, binding, vnode) {
    const model = Generator.resolveModel(binding, vnode);
    const options = Config.resolve(vnode.context);

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
      validity: options.validity,
      aria: options.aria,
      initialValue: Generator.resolveInitialValue(vnode)
    };
  }

  static getCtorConfig (vnode) {
    if (!vnode.child) return null;

    const config = getPath('child.$options.$_veeValidate', vnode);

    return config;
  }

  /**
   * Resolves the rules defined on an element.
   */
  static resolveRules (el, binding) {
    if (!binding.value && (!binding || !binding.expression)) {
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
   * @param {*} vnode
   */
  static resolveInitialValue (vnode) {
    const model = vnode.data.model || find(vnode.data.directives, d => d.name === 'model');

    return model && model.value;
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
        validate: vm.$validator.validate.bind(vm.$validator),
        update: vm.$validator.update.bind(vm.$validator)
      } : null
    };
  }

  /**
   * Resolves the delay value.
   * @param {*} el
   * @param {*} vnode
   * @param {Object} options
   */
  static resolveDelay (el, vnode, options) {
    let delay = getDataAttribute(el, 'delay');
    let globalDelay = (options && 'delay' in options) ? options.delay : 0;

    if (!delay && vnode.child && vnode.child.$attrs) {
      delay = vnode.child.$attrs['data-vv-delay'];
    }

    return (delay) ? { local: { input: parseInt(delay) }, global: deepParseInt(globalDelay) } : { global: deepParseInt(globalDelay) };
  }

  /**
   * Resolves the events to validate in response to.
   * @param {*} el
   * @param {*} vnode
   */
  static resolveEvents (el, vnode) {
    let events = getDataAttribute(el, 'validate-on');

    if (!events && vnode.child && vnode.child.$attrs) {
      events = vnode.child.$attrs['data-vv-validate-on'];
    }

    if (!events && vnode.child) {
      const config = Generator.getCtorConfig(vnode);
      events = config && config.events;
    }

    return events;
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

    if (vnode.child && isNullOrUndefined(scope)) {
      scope = vnode.child.$attrs && vnode.child.$attrs['data-vv-scope'];
    }

    return !isNullOrUndefined(scope) ? scope : getScope(el);
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
    let name = getDataAttribute(el, 'name');

    if (!name && !vnode.child) {
      return el.name;
    }

    if (!name && vnode.child && vnode.child.$attrs) {
      name = vnode.child.$attrs['data-vv-name'] || vnode.child.$attrs['name'];
    }

    if (!name && vnode.child) {
      const config = Generator.getCtorConfig(vnode);
      if (config && isCallable(config.name)) {
        const boundGetter = config.name.bind(vnode.child);

        return boundGetter();
      }

      return vnode.child.name;
    }

    return name;
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
      const path = getDataAttribute(el, 'value-path') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-value-path']);
      if (path) {
        return () => {
          return getPath(path, vnode.child);
        };
      }

      const config = Generator.getCtorConfig(vnode);
      if (config && isCallable(config.value)) {
        const boundGetter = config.value.bind(vnode.child);

        return () => {
          return boundGetter();
        };
      }

      return () => {
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
