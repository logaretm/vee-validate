import Config from './config';
import Validator from './core/validator';
import { createFlags, find, assign, isCallable, isNullOrUndefined } from './utils';

let $validator = null;

// function hasModel (vnode) {
//   return !!(vnode.data && vnode.data.directives && find(vnode.data.directives, d => d.name === 'model'));
// }

function getModel (vnode) {
  if (!vnode.data) {
    return null;
  }

  return find(vnode.data.directives, d => d.name === 'model');
}

// function findModelNode (vnode) {
//   if (hasModel(vnode)) {
//     return vnode;
//   }

//   if (vnode.children && vnode.children.length) {
//     return toArray(vnode.children).reduce((candidate, node) => {
//       if (candidate) {
//         return candidate;
//       }

//       return findModelNode(node);
//     }, null);
//   }

//   return null;
// }

function addListenerToNode (node, eventName, handler) {
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
  // TODO: Handle other input types like select, custom components, etc...
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

// function searchNodesRecursive (nodes) {
//   if (Array.isArray(nodes)) {
//     return toArray(nodes).reduce((candidate, node) => {
//       if (candidate) {
//         return candidate;
//       }

//       return findModelNode(node);
//     }, null);
//   }

//   return findModelNode(nodes);
// }

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

    const scope = this.$scopedSlots.default(ctx);
    // Add the listener on the vnode
    // TODO: Decide which node to place the events on.
    addListener.call(this, scope[0]); // Temporary setup

    return h('div', scope);
  }
};
