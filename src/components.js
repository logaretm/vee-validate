import Config from './config';
import Validator from './core/validator';
import { createFlags, find, assign, isCallable, toArray, isNullOrUndefined, isTextInput } from './utils';

let $validator = null;

function hasModel (vnode) {
  if (!vnode.data) return false;

  if (vnode.data.model) {
    return true;
  }

  return !!(vnode.data.directives && find(vnode.data.directives, d => d.name === 'model'));
}

function getModel (vnode) {
  if (!vnode.data) {
    return null;
  }

  if (vnode.data.model) {
    return vnode.data.model;
  }

  return find(vnode.data.directives, d => d.name === 'model');
}

function findModelNodes (vnode) {
  if (hasModel(vnode)) {
    return [vnode];
  }

  if (vnode.children && vnode.children.length) {
    return toArray(vnode.children).reduce((nodes, node) => {
      const candidates = [...findModelNodes(node)];
      if (candidates.length) {
        nodes.push(...candidates);
      }

      return nodes;
    }, []);
  }

  return [];
}

function addListenerToNode (node, eventName, handler) {
  if (isNullOrUndefined(node.data.on)) {
    node.data.on = {};
  }

  const listeners = node.data.on;
  // Has a single listener.
  if (isCallable(listeners[eventName])) {
    const prevHandler = listeners[eventName];
    listeners[eventName] = [prevHandler];
  }

  // has other listeners.
  if (Array.isArray(listeners[eventName])) {
    listeners[eventName].push(handler);
    return;
  }

  // no listener at all.
  if (isNullOrUndefined(listeners[eventName])) {
    listeners[eventName] = handler;
  }
}

function addListener (node) {
  if (!node) {
    return false;
  }

  const model = getModel(node);
  if (!model) {
    return false;
  }

  let eventName = model.modifiers && model.modifiers.lazy ? 'change' : 'input';
  if (node.tag === 'select' || (node.data.attrs && !isTextInput({ type: node.data.attrs.type }))) {
    eventName = 'change';
  }

  addListenerToNode(node, eventName, e => {
    $validator.verify(e.target.value, this.rules).then(({ errors }) => {
      this.messages = errors;
      // TODO: Set ALL FLAGS
      this.flags = assign({}, this.flags, {
        valid: !errors.length,
        invalid: !!errors.length,
        validated: true
      });
    });
  });

  return true;
}

export const ValidationProvider = {
  props: {
    name: {
      type: String
    },
    alias: {
      type: String
    },
    events: {
      type: [Array, String]
    },
    rules: {
      type: [Object, String]
    }
  },
  data: () => ({
    messages: [],
    flags: createFlags()
  }),
  computed: {
    classes () {
      const names = Config.current.classNames;
      return Object.keys(this.flags).reduce((classes, flag) => {
        const className = (names && names[flag]) || flag;
        if (className) {
          classes[className] = this.flags[flag];
        }

        return classes;
      }, {});
    }
  },
  render (h) {
    if (!$validator) {
      $validator = new Validator(null);
    }

    const ctx = {
      errors: this.messages,
      flags: this.flags,
      classes: this.classes
    };

    const nodes = this.$scopedSlots.default(ctx);
    // Handle multi-root slot.
    const inputs = findModelNodes(Array.isArray(nodes) ? { children: nodes } : nodes);
    // Add the listener on the vnode
    // TODO: Decide which node to place the events on.
    inputs.forEach(input => {
      addListener.call(this, input); // Temporary setup
    });

    return h('div', nodes);
  }
};
