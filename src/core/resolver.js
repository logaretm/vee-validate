import { resolveConfig, getConfig } from '../config';
import {
  getDataAttribute,
  isObject,
  getPath,
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
      immediate: !!binding.modifiers.initial || !!binding.modifiers.immediate,
      listen: !binding.modifiers.disable,
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
}
