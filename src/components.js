import Config from './config';
import Validator from './core/validator';
import { createFlags, find, assign, isCallable, toArray, isNullOrUndefined, isTextInput, isEvent } from './utils';

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
    listeners[eventName] = [handler];
  }
}

function addListenerToComponentNode (node, eventName, handler) {
  const listeners = node.componentOptions.listeners;
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
    listeners[eventName] = [handler];
  }
}

function shouldUseOnChange (vnode, model) {
  // Is a component.
  if (vnode.componentOptions) {
    return false;
  }

  // Lazy Models typically use lazy modifiers.
  if (model && model.modifiers && model.modifiers.lazy) {
    return true;
  }

  // is a textual-type input.
  if (vnode.data.attrs && isTextInput({ type: vnode.data.attrs.type })) {
    return false;
  }

  return true;
}

function addListener (node) {
  if (!node) {
    return false;
  }

  const model = getModel(node);
  if (!model) {
    return false;
  }

  const eventName = shouldUseOnChange(node, model) ? 'change' : 'input';

  const validate = e => {
    const value = isEvent(e) ? e.target.value : e;
    $validator.verify(value, this.rules).then(({ errors }) => {
      this.messages = errors;
      // TODO: Set ALL FLAGS
      this.flags = assign({}, this.flags, {
        valid: !errors.length,
        invalid: !!errors.length,
        validated: true
      });
    });
  };

  if (node.componentOptions) {
    addListenerToComponentNode(node, eventName, validate);
  } else {
    addListenerToNode(node, eventName, validate);
  }
  console.log(node);

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
    inputs.forEach(input => {
      addListener.call(this, input); // Temporary setup
    });

    return h('div', nodes);
  }
};
