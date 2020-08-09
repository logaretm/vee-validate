/* eslint-disable @typescript-eslint/ban-types */
import Vue, { VNode, VNodeDirective } from 'vue';
import { find, isCallable, isNullOrUndefined, includes, isSpecified } from './index';
import { normalizeRules } from './rules';
import { RuleContainer } from '../extend';

export const isTextInput = (vnode: VNode): boolean => {
  const attrs = vnode.data?.attrs || vnode.elm;

  // it will fallback to being a text input per browsers spec.
  if (vnode.tag === 'input' && (!attrs || !attrs.type)) {
    return true;
  }

  if (vnode.tag === 'textarea') {
    return true;
  }

  return includes(['text', 'password', 'search', 'email', 'tel', 'url', 'number'], attrs?.type);
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

export function findValue(vnode: VNode): { value: any } | undefined {
  const model = findModel(vnode);
  if (model) {
    return { value: model.value };
  }

  const config = findModelConfig(vnode);
  const prop = config?.prop || 'value';
  if (vnode.componentOptions?.propsData && prop in vnode.componentOptions.propsData) {
    const propsDataWithValue = vnode.componentOptions.propsData as any;
    return { value: propsDataWithValue[prop] };
  }

  if (vnode.data?.domProps && 'value' in vnode.data.domProps) {
    return { value: vnode.data.domProps.value };
  }

  return undefined;
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

export function findInputNodes(vnode: VNode | VNode[]): VNode[] {
  if (!Array.isArray(vnode) && findValue(vnode) !== undefined) {
    return [vnode];
  }

  const children = extractChildren(vnode);

  return children.reduce((nodes: VNode[], node): VNode[] => {
    const candidates = findInputNodes(node);
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
  // no listener at all.
  if (isNullOrUndefined(obj[eventName])) {
    obj[eventName] = [handler];
    return;
  }

  // Is an invoker.
  if (isCallable(obj[eventName]) && obj[eventName].fns) {
    const invoker = obj[eventName];
    invoker.fns = Array.isArray(invoker.fns) ? invoker.fns : [invoker.fns];
    if (!includes(invoker.fns, handler)) {
      invoker.fns.push(handler);
    }

    return;
  }

  if (isCallable(obj[eventName])) {
    const prev = obj[eventName];
    obj[eventName] = [prev];
  }

  if (Array.isArray(obj[eventName]) && !includes(obj[eventName], handler)) {
    obj[eventName].push(handler);
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
  if (model?.modifiers?.lazy) {
    return 'change';
  }

  // is a textual-type input.
  if (isTextInput(vnode)) {
    return 'input';
  }

  return 'change';
}

export function isHTMLNode(node: VNode) {
  return includes(['input', 'select', 'textarea'], node.tag);
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
  const attrs = vnode.data?.attrs;
  const rules: Record<string, any> = {};

  if (!attrs) return rules;

  if (attrs.type === 'email' && RuleContainer.getRuleDefinition('email')) {
    rules.email = ['multiple' in attrs];
  }

  if (attrs.pattern && RuleContainer.getRuleDefinition('regex')) {
    rules.regex = attrs.pattern;
  }

  if (attrs.maxlength >= 0 && RuleContainer.getRuleDefinition('max')) {
    rules.max = attrs.maxlength;
  }

  if (attrs.minlength >= 0 && RuleContainer.getRuleDefinition('min')) {
    rules.min = attrs.minlength;
  }

  if (attrs.type === 'number') {
    if (isSpecified(attrs.min) && RuleContainer.getRuleDefinition('min_value')) {
      rules.min_value = Number(attrs.min);
    }

    if (isSpecified(attrs.max) && RuleContainer.getRuleDefinition('max_value')) {
      rules.max_value = Number(attrs.max);
    }
  }

  return rules;
}

export function resolveRules(vnode: VNode) {
  const htmlTags = ['input', 'select', 'textarea'];
  const attrs = vnode.data?.attrs;

  if (!includes(htmlTags, vnode.tag) || !attrs) {
    return {};
  }

  const rules: Record<string, any> = {};
  if ('required' in attrs && attrs.required !== false && RuleContainer.getRuleDefinition('required')) {
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
