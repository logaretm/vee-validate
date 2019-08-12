// VNode Utils
import { find, isCallable, isNullOrUndefined, isTextInput } from './index';

// Gets the model object on the vnode.
export function findModel (vnode) {
  if (!vnode.data) {
    return null;
  }

  // Component Model
  if (vnode.data.model) {
    return vnode.data.model;
  }

  return !!(vnode.data.directives) && find(vnode.data.directives, d => d.name === 'model');
}

function extractChildren (vnode) {
  if (Array.isArray(vnode)) {
    return vnode;
  }

  if (Array.isArray(vnode.children)) {
    return vnode.children;
  }

  if (vnode.componentOptions && Array.isArray(vnode.componentOptions.children)) {
    return vnode.componentOptions.children;
  }

  return [];
}

export function extractVNodes (vnode) {
  if (findModel(vnode)) {
    return [vnode];
  }

  const children = extractChildren(vnode);

  return children.reduce((nodes, node) => {
    const candidates = extractVNodes(node);
    if (candidates.length) {
      nodes.push(...candidates);
    }

    return nodes;
  }, []);
}

// Resolves v-model config if exists.
export function findModelConfig (vnode) {
  if (!vnode.componentOptions) return null;

  return vnode.componentOptions.Ctor.options.model;
};

// Adds a listener to vnode listener object.
export function mergeVNodeListeners (obj, eventName, handler) {
  // Has a single listener, convert to array.
  if (isCallable(obj[eventName])) {
    const prevHandler = obj[eventName];
    obj[eventName] = [prevHandler];
  }

  // no listeners, create the array.
  if (isNullOrUndefined(obj[eventName])) {
    obj[eventName] = [];
  }

  obj[eventName].push(handler);
}

// Adds a listener to a native HTML vnode.
function addNativeNodeListener (node, eventName, handler) {
  if (isNullOrUndefined(node.data.on)) {
    node.data.on = {};
  }

  mergeVNodeListeners(node.data.on, eventName, handler);
}

// Adds a listener to a Vue component vnode.
function addComponentNodeListener (node, eventName, handler) {
  /* istanbul ignore next */
  if (!node.componentOptions.listeners) {
    node.componentOptions.listeners = {};
  }

  mergeVNodeListeners(node.componentOptions.listeners, eventName, handler);
};

export function addVNodeListener (vnode, eventName, handler) {
  if (vnode.componentOptions) {
    addComponentNodeListener(vnode, eventName, handler);
    return;
  }

  addNativeNodeListener(vnode, eventName, handler);
};

// Determines if `change` should be used over `input` for listeners.
export function getInputEventName (vnode, model) {
  // Is a component.
  if (vnode.componentOptions) {
    const { event } = findModelConfig(vnode) || { event: 'input' };

    return event;
  }

  // Lazy Models and select tag typically use change event
  if ((model && model.modifiers && model.modifiers.lazy) || vnode.tag === 'select') {
    return 'change';
  }

  // is a textual-type input.
  if (vnode.data.attrs && isTextInput({ type: vnode.data.attrs.type || 'text' })) {
    return 'input';
  }

  return 'change';
}

export function normalizeSlots (slots, ctx) {
  return Object.keys(slots).reduce((arr, key) => {
    slots[key].forEach((vnode) => {
      if (!vnode.context) {
        slots[key].context = ctx;
        if (!vnode.data) {
          vnode.data = {};
        }
        vnode.data.slot = key;
      }
    });

    return arr.concat(slots[key]);
  }, []);
};

export function createRenderless (h, children) {
  // Only render the first item of the node.
  if (Array.isArray(children) && children[0]) {
    return children[0];
  }

  // a single node.
  if (children) {
    return children;
  }

  // No slots, render nothing.
  return h();
};
