import { resolveConfig, getConfig } from '../config';
import { findModel } from '../utils/vnode';
import {
  getDataAttribute,
  isObject,
  toArray,
  find,
  getPath,
  hasPath,
  isNullOrUndefined,
  isCallable,
  deepParseInt,
  fillRulesFromElement,
  includes,
  normalizeRules,
  assign
} from '../utils';

/**
 * Generates the options required to construct a field.
 */
export default class Resolver {
  static generate (el, binding, vnode) {
    const model = Resolver.resolveModel(binding, vnode);
    const options = resolveConfig(vnode.context);

    return {
      alias: Resolver.resolveAlias(el, vnode),
      aria: options.aria && !vnode.componentInstance,
      bails: binding.modifiers.bails ? true : (binding.modifiers.continues === true ? false : undefined),
      classes: options.classes,
      classNames: options.classNames,
      component: vnode.componentInstance,
      delay: Resolver.resolveDelay(el, vnode, options),
      el: el,
      getter: Resolver.resolveGetter(el, vnode, model),
      immediate: !!binding.modifiers.initial || !!binding.modifiers.immediate,
      initialValue: Resolver.resolveInitialValue(vnode),
      listen: !binding.modifiers.disable,
      model,
      name: Resolver.resolveName(el, vnode),
      persist: !!binding.modifiers.persist,
      rules: Resolver.resolveRules(el, binding, vnode),
      validity: options.validity && !vnode.componentInstance
    };
  }

  static getCtorConfig (vnode) {
    if (!vnode.componentInstance) return null;

    const config = getPath('componentInstance.$options.$_veeValidate', vnode);

    return config;
  }

  /**
   * Resolves the rules defined on an element.
   */
  static resolveRules (el, binding, vnode) {
    let rules = '';
    if (!binding.value && (!binding || !binding.expression)) {
      rules = getDataAttribute(el, 'rules');
    }

    if (binding.value && includes(['string', 'object'], typeof binding.value.rules)) {
      rules = binding.value.rules;
    } else if (binding.value) {
      rules = binding.value;
    }

    if (vnode.componentInstance) {
      return rules;
    }

    // If validity is disabled, ignore field rules.
    const normalized = normalizeRules(rules);
    if (!getConfig().useConstraintAttrs) {
      return normalized;
    }

    return assign({}, fillRulesFromElement(el, {}), normalized);
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
        update: vm.$validator.update.bind(vm.$validator),
        _resolveField: vm.$validator._base._resolveField.bind(vm.$validator)
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
    const globalDelay = (options && 'delay' in options) ? options.delay : 0;

    if (!delay && vnode.componentInstance && vnode.componentInstance.$attrs) {
      delay = vnode.componentInstance.$attrs['data-vv-delay'];
    }

    if (!isObject(globalDelay)) {
      return deepParseInt(delay || globalDelay);
    }

    if (!isNullOrUndefined(delay)) {
      globalDelay.input = delay;
    }

    return deepParseInt(globalDelay);
  }

  static resolveAlias (el, vnode) {
    const ctorConfig = Resolver.getCtorConfig(vnode);
    let alias = null;
    if (ctorConfig && ctorConfig.alias) {
      alias = isCallable(ctorConfig.alias) ? ctorConfig.alias.call(vnode.componentInstance) : ctorConfig.alias;
    }

    if (!alias && el) {
      alias = getDataAttribute(el, 'as');
    }

    if (!alias && vnode.componentInstance) {
      return vnode.componentInstance.$attrs && vnode.componentInstance.$attrs['data-vv-as'];
    }

    return alias;
  }

  /**
   * Checks if the node directives contains a v-model or a specified arg.
   * Args take priority over models.
   *
   * @return {Object}
   */
  static resolveModel (binding, vnode) {
    if (binding.arg) {
      return { expression: binding.arg };
    }

    const model = findModel(vnode);
    if (!model) {
      return null;
    }

    // https://github.com/vuejs/vue/blob/dev/src/core/util/lang.js#L26
    const watchable = !/[^\w.$]/.test(model.expression) && hasPath(model.expression, vnode.context);
    const lazy = !!(model.modifiers && model.modifiers.lazy);

    if (!watchable) {
      return { expression: null, lazy };
    }

    return { expression: model.expression, lazy };
  }

  /**
   * Resolves the field name to trigger validations.
   * @return {String} The field name.
   */
  static resolveName (el, vnode) {
    let name = getDataAttribute(el, 'name');

    if (!vnode.componentInstance && vnode.data.attrs.name) {
      return vnode.data.attrs.name;
    }

    if (!name && !vnode.componentInstance) {
      return el.name;
    }

    if (!name && vnode.componentInstance && vnode.componentInstance.$attrs) {
      name = vnode.componentInstance.$attrs['data-vv-name'] || vnode.componentInstance.$attrs['name'];
    }

    if (!name && vnode.componentInstance) {
      const config = Resolver.getCtorConfig(vnode);
      if (config && isCallable(config.name)) {
        const boundGetter = config.name.bind(vnode.componentInstance);

        return boundGetter();
      }

      return vnode.componentInstance.name;
    }

    return name;
  }

  /**
   * Returns a value getter input type.
   */
  static resolveGetter (el, vnode, model) {
    if (model && model.expression) {
      return () => {
        return getPath(model.expression, vnode.context);
      };
    }

    if (vnode.componentInstance) {
      const path = getDataAttribute(el, 'value-path') || (vnode.componentInstance.$attrs && vnode.componentInstance.$attrs['data-vv-value-path']);
      if (path) {
        return () => {
          return getPath(path, vnode.componentInstance);
        };
      }

      const config = Resolver.getCtorConfig(vnode);
      if (config && isCallable(config.value)) {
        const boundGetter = config.value.bind(vnode.componentInstance);

        return () => {
          return boundGetter();
        };
      }

      const { prop } = vnode.componentInstance.$options.model || { prop: 'value' };

      return () => {
        return vnode.componentInstance[prop];
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
