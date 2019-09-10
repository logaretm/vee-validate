// VNode Utils
import { find, isCallable, isNullOrUndefined, includes, normalizeRules, isSpecified } from './index';
import Vue, { VNode, VNodeDirective } from 'vue';

export const isTextInput = (vnode: VNode): boolean => {
  const attrs = (vnode.data && vnode.data.attrs) || vnode.elm;

  // it will fallback to being a text input per browsers spec.
  if (vnode.tag === 'input' && (!attrs || !attrs.type)) {
    return true;
  }

  return includes(['text', 'password', 'search', 'email', 'tel', 'url', 'textarea', 'number'], attrs && attrs.type);
};

// export const isCheckboxOrRadioInput = (vnode: VNode): boolean => {
//   const attrs = (vnode.data && vnode.data.attrs) || vnode.elm;

//   return includes(['radio', 'checkbox'], attrs && attrs.type);
// };

// Gets the model object on the vnode.
export function findModel(vnode: VNode): VNodeDirective | undefined {
  if (!vnode.data) {
    return undefined;
  }

  // Component Model
  // THIS IS NOT TYPED IN OFFICIAL VUE TYPINGS
  // eslint-disable-next-line
  const nonStandardVNodeData = vnode.data as any;
  if ('model' in nonStandardVNodeData) {
    return nonStandardVNodeData.model;
  }

  if (!vnode.data.directives) {
    return undefined;
  }

  return find(vnode.data.directives, d => d.name === 'model');
}

function extractChildren(vnode: VNode | VNode[]): VNode[] {
  if (Array.isArray(vnode)) {
    return vnode;
  }

  if (Array.isArray(vnode.children)) {
    return vnode.children;
  }

  /* istanbul ignore next */
  if (vnode.componentOptions && Array.isArray(vnode.componentOptions.children)) {
    return vnode.componentOptions.children;
  }

  return [];
}

export function extractVNodes(vnode: VNode | VNode[]): VNode[] {
  if (!Array.isArray(vnode) && findModel(vnode)) {
    return [vnode];
  }

  const children = extractChildren(vnode);

  return children.reduce((nodes: VNode[], node): VNode[] => {
    const candidates = extractVNodes(node);
    if (candidates.length) {
      nodes.push(...candidates);
    }

    return nodes;
  }, []);
}

// Resolves v-model config if exists.
export function findModelConfig(vnode: VNode): { prop: string; event: string } | null {
  /* istanbul ignore next */
  if (!vnode.componentOptions) return null;

  // This is also not typed in the standard Vue TS.
  return (vnode.componentOptions.Ctor as any).options.model;
}

// Adds a listener to vnode listener object.
export function mergeVNodeListeners(obj: any, eventName: string, handler: Function): void {
  // Has a single listener.
  if (isCallable(obj[eventName])) {
    const prevHandler = obj[eventName];
    obj[eventName] = [prevHandler];
  }

  // has other listeners.
  if (Array.isArray(obj[eventName])) {
    obj[eventName].push(handler);
    return;
  }

  // no listener at all.
  if (isNullOrUndefined(obj[eventName])) {
    obj[eventName] = [handler];
  }
}

// Adds a listener to a native HTML vnode.
function addNativeNodeListener(node: VNode, eventName: string, handler: Function): void {
  /* istanbul ignore next */
  if (!node.data) {
    node.data = {};
  }

  if (isNullOrUndefined(node.data.on)) {
    node.data.on = {};
  }

  mergeVNodeListeners(node.data.on, eventName, handler);
}

// Adds a listener to a Vue component vnode.
function addComponentNodeListener(node: VNode, eventName: string, handler: Function): void {
  /* istanbul ignore next */
  if (!node.componentOptions) {
    return;
  }

  /* istanbul ignore next */
  if (!node.componentOptions.listeners) {
    node.componentOptions.listeners = {};
  }

  mergeVNodeListeners(node.componentOptions.listeners, eventName, handler);
}

export function addVNodeListener(vnode: VNode, eventName: string, handler: Function): void {
  if (vnode.componentOptions) {
    addComponentNodeListener(vnode, eventName, handler);
    return;
  }

  addNativeNodeListener(vnode, eventName, handler);
}

// Determines if `change` should be used over `input` for listeners.
export function getInputEventName(vnode: VNode, model?: VNodeDirective): string {
  // Is a component.
  if (vnode.componentOptions) {
    const { event } = findModelConfig(vnode) || { event: 'input' };

    return event;
  }

  // Lazy Models typically use change event
  if (model && model.modifiers && model.modifiers.lazy) {
    return 'change';
  }

  // is a textual-type input.
  if (isTextInput(vnode)) {
    return 'input';
  }

  return 'change';
}

// TODO: Type this one properly.
export function normalizeSlots(slots: any, ctx: Vue): VNode[] {
  const acc: VNode[] = [];

  return Object.keys(slots).reduce((arr, key): VNode[] => {
    slots[key].forEach((vnode: VNode): void => {
      if (!vnode.context) {
        slots[key].context = ctx;
        if (!vnode.data) {
          vnode.data = {};
        }
        vnode.data.slot = key;
      }
    });

    return arr.concat(slots[key]);
  }, acc);
}

function resolveTextualRules(vnode: VNode): Record<string, any> {
  const attrs = vnode.data && vnode.data.attrs;
  const rules: Record<string, any> = {};

  if (!attrs) return rules;

  if (attrs.type === 'email') {
    rules.email = ['multiple' in attrs];
  }

  if (attrs.pattern) {
    rules.regex = attrs.pattern;
  }

  if (attrs.maxlength >= 0) {
    rules.max = attrs.maxlength;
  }

  if (attrs.minlength >= 0) {
    rules.min = attrs.minlength;
  }

  if (attrs.type === 'number') {
    if (isSpecified(attrs.min)) {
      rules.min_value = Number(attrs.min);
    }

    if (isSpecified(attrs.max)) {
      rules.max_value = Number(attrs.max);
    }
  }

  return rules;
}

export function resolveRules(vnode: VNode) {
  const htmlTags = ['input', 'select'];
  const attrs = vnode.data && vnode.data.attrs;

  if (!includes(htmlTags, vnode.tag) || !attrs) {
    return {};
  }

  const rules: Record<string, any> = {};
  if ('required' in attrs && attrs.required !== false) {
    rules.required = attrs.type === 'checkbox' ? [true] : true;
  }

  if (isTextInput(vnode)) {
    return normalizeRules({ ...rules, ...resolveTextualRules(vnode) });
  }

  return normalizeRules(rules);
}

export function normalizeChildren(context: Vue, slotProps: any): VNode[] {
  if (context.$scopedSlots.default) {
    return context.$scopedSlots.default(slotProps) || [];
  }

  return context.$slots.default || [];
}
