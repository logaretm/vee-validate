import { DirectiveBinding } from 'vue/types/options';
import { VNode } from 'vue';
import { resolveConfig, getConfig } from '../config';
import { resolveRules, findModel, isTextInput } from '../utils/vnode';
import { getDataAttribute, getPath, isCallable, includes, normalizeRules } from '../utils';

export function resolveFeatures(binding: DirectiveBinding, vnode: VNode) {
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

function getCtorConfig(vnode: VNode) {
  if (!vnode.componentInstance) return null;

  const config = getPath('componentInstance.$options.$_veeValidate', vnode);

  return config;
}

export function resolveDirectiveRules(binding: DirectiveBinding, vnode: VNode) {
  let rules = '';
  if (binding.value && includes(['string', 'object'], typeof binding.value.rules)) {
    rules = binding.value.rules;
  } else if (binding.value) {
    rules = binding.value;
  }

  const normalized = normalizeRules(rules);
  if (vnode.componentInstance) {
    return normalized;
  }

  // If validity is disabled, ignore field rules.
  if (!getConfig().useConstraintAttrs) {
    return normalized;
  }

  const combined = { ...resolveRules(vnode), ...normalized };
  Object.defineProperty(combined, '_$$isNormalized', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });

  return combined;
}

export function resolveAlias(el: HTMLElement, vnode: VNode) {
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

export function resolveName(el: HTMLElement, vnode: VNode) {
  let name = getDataAttribute(el, 'name');

  if (!vnode.componentInstance && vnode.data && vnode.data.attrs && vnode.data.attrs.name) {
    return vnode.data.attrs.name;
  }

  if (!name && !vnode.componentInstance) {
    return (el as HTMLInputElement).name;
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

    return (vnode.componentInstance as any).name;
  }

  return name;
}

export function resolveValue(el: HTMLElement, vnode: VNode) {
  const model = findModel(vnode);
  if (model) {
    return model.value;
  }

  const input = el as HTMLInputElement;
  if (isTextInput(vnode)) {
    return input.value;
  }

  if (input.type === 'file') {
    return input.files;
  }

  // TODO: Radio and Checkboxes resolution.

  if (vnode.tag === 'select') {
    return input.value;
  }

  return undefined;
}
