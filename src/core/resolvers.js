import { resolveConfig, getConfig } from '../config';
import { resolveRules } from '../utils/vnode';
import {
  getDataAttribute,
  getPath,
  isCallable,
  includes,
  normalizeRules,
  assign
} from '../utils';

export function resolveFeatures (binding, vnode) {
  const options = resolveConfig(vnode.context);

  let bails = options.bails;
  const modifiers = binding.modifiers || {};
  if (modifiers.bails) {
    bails = true;
  } else if (modifiers.continues) {
    bails = false;
  }

  return {
    aria: !!options.aria,
    classes: !!options.classes,
    classNames: options.classNames,
    bails: bails,
    validity: !!options.validity,
    persist: !!modifiers.persist,
    immediate: !!modifiers.immediate,
    listen: !modifiers.disable
  };
}

function getCtorConfig (vnode) {
  if (!vnode.componentInstance) return null;

  const config = getPath('componentInstance.$options.$_veeValidate', vnode);

  return config;
}

export function resolveDirectiveRules (el, binding, vnode) {
  let rules = '';
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

  return assign({}, resolveRules(vnode), normalized);
}

export function resolveAlias (el, vnode) {
  const ctorConfig = getCtorConfig(vnode);
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

export function resolveName (el, vnode) {
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
    const config = getCtorConfig(vnode);
    if (config && isCallable(config.name)) {
      const boundGetter = config.name.bind(vnode.componentInstance);

      return boundGetter();
    }

    return vnode.componentInstance.name;
  }

  return name;
}
