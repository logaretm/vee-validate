import { VNode, SetupContext } from 'vue';
import { includes, isSpecified, upperCaseFirst } from './index';
import { normalizeRules } from './rules';
import { RuleContainer } from '../extend';

// FIXME: The first `on` is probably a mistake.
export const UPDATE_MODEL_EVENT = 'onUpdate:modelValue';

export const HTML_TAGS = ['input', 'select', 'textarea'];

export const isTextInput = (vnode: VNode) => {
  if (typeof vnode.type === 'object') {
    return false;
  }

  // it will fallback to being a text input per browsers spec.
  if (vnode.type === 'textarea') {
    return true;
  }

  return includes([undefined, 'text', 'password', 'search', 'email', 'tel', 'url', 'number'], vnode.props?.type);
};

// export const isCheckboxOrRadioInput = (vnode: VNode): boolean => {
//   const attrs = (vnode.data && vnode.data.attrs) || vnode.elm;

//   return includes(['radio', 'checkbox'], attrs && attrs.type);
// };

// Gets the model object on the vnode.
export function findModel(vnode: VNode) {
  if (!vnode.props) {
    return undefined;
  }

  if ('modelValue' in vnode.props) {
    return { value: vnode.props.modelValue };
  }

  return undefined;
}

export function findValue(vnode: VNode) {
  const model = findModel(vnode);
  if (model) {
    return { value: model.value };
  }

  // const config = findModelConfig(vnode);
  // const prop = config?.prop || 'value';
  // if (vnode.componentOptions?.propsData && prop in vnode.componentOptions.propsData) {
  //   const propsDataWithValue = vnode.componentOptions.propsData as any;
  //   return { value: propsDataWithValue[prop] };
  // }

  if (vnode.props && 'value' in vnode.props) {
    return { value: vnode.props.value };
  }

  return undefined;
}

function extractChildren(vnode: VNode | VNode[]): VNode[] {
  if (Array.isArray(vnode)) {
    return vnode;
  }

  if (Array.isArray(vnode.children)) {
    return vnode.children as VNode[];
  }

  const componentChildren = vnode.component?.subTree;
  if (componentChildren) {
    return [componentChildren];
  }

  return [];
}

export function extractVNodes(vnode: VNode | VNode[]): VNode[] {
  if (!Array.isArray(vnode) && findValue(vnode) !== undefined) {
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
export function findModelConfig() {
  // /* istanbul ignore next */
  // if (!vnode.componentOptions) return null;
  // // This is also not typed in the standard Vue TS.
  // return (vnode.componentOptions.Ctor as any).options.model;
}

export function addVNodeListener(vnode: VNode, eventName: string, handler: Function): void {
  const eventPropName = `on${upperCaseFirst(eventName)}`;
  if (!vnode.props) {
    vnode.props = {};
  }

  if (!vnode.props[eventPropName]) {
    vnode.props[eventPropName] = handler;
    return;
  }

  if (vnode.props[eventPropName] === handler) {
    return;
  }

  const evtObj = vnode.props[eventPropName];
  if (Array.isArray(evtObj) && evtObj.indexOf(handler) === -1) {
    evtObj.push(handler);
    return;
  }

  if (typeof evtObj === 'function') {
    vnode.props[eventPropName] = [evtObj, handler];
    return;
  }

  console.log('Cannot handle this evt obj!', evtObj);
}

// Determines if `change` should be used over `input` for listeners.
export function getInputEventName(vnode: VNode): string {
  // Is a component.
  if (typeof vnode.type !== 'string') {
    // FIXME: this works, but probably a bug in Vue.
    return UPDATE_MODEL_EVENT;
  }

  // is a textual-type input.
  if (isTextInput(vnode)) {
    return 'input';
  }

  return 'change';
}

export function isHTMLNode(node: VNode) {
  return includes(HTML_TAGS, node.type);
}

function resolveTextualRules(vnode: VNode) {
  const props = vnode.props;
  const rules: Record<string, any> = {};

  if (!props) return rules;

  if (props.type === 'email' && RuleContainer.getRuleDefinition('email')) {
    rules.email = ['multiple' in props];
  }

  if (props.pattern && RuleContainer.getRuleDefinition('regex')) {
    rules.regex = props.pattern;
  }

  if (props.maxlength >= 0 && RuleContainer.getRuleDefinition('max')) {
    rules.max = props.maxlength;
  }

  if (props.minlength >= 0 && RuleContainer.getRuleDefinition('min')) {
    rules.min = props.minlength;
  }

  if (props.type === 'number') {
    if (isSpecified(props.min) && RuleContainer.getRuleDefinition('min_value')) {
      rules.min_value = Number(props.min);
    }
    if (isSpecified(props.max) && RuleContainer.getRuleDefinition('max_value')) {
      rules.max_value = Number(props.max);
    }
  }

  return rules;
}

export function resolveRules(vnode: VNode) {
  if (!includes(HTML_TAGS, vnode.type) || !vnode.props) {
    return {};
  }

  const rules: Record<string, any> = {};
  if ('required' in vnode.props && vnode.props.required !== false && RuleContainer.getRuleDefinition('required')) {
    rules.required = vnode.props.type === 'checkbox' ? [true] : true;
  }

  if (isTextInput(vnode)) {
    return normalizeRules({ ...rules, ...resolveTextualRules(vnode) });
  }

  return normalizeRules(rules);
}

export function normalizeChildren(context: SetupContext, slotProps: any) {
  if (!context.slots.default) {
    return [];
  }

  return context.slots.default(slotProps) || [];
}
