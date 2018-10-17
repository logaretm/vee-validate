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

function findModelConfig (vnode) {
  if (!vnode.componentOptions) return null;

  return assign({}, { event: 'input', prop: 'value' }, vnode.componentOptions.Ctor.options.model);
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

function addListenerToListenersObject (obj, eventName, handler) {
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

function addListenerToNode (node, eventName, handler) {
  if (isNullOrUndefined(node.data.on)) {
    node.data.on = {};
  }

  addListenerToListenersObject(node.data.on, eventName, handler);
}

function addListenerToComponentNode (node, eventName, handler) {
  if (!node.componentOptions.listeners) {
    node.componentOptions.listeners = {};
  }

  const { event } = findModelConfig(node) || { event: eventName, prop: 'value' };
  addListenerToListenersObject(node.componentOptions.listeners, event, handler);
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

function addListeners (node) {
  if (!node) {
    return false;
  }

  const model = getModel(node);
  if (!model) {
    return false;
  }

  const eventName = shouldUseOnChange(node, model) ? 'change' : 'input';
  this.value = this.initialValue = model.value; // start tracking the value.
  const validate = e => {
    this.setFlags({ pending: true });
    const value = isEvent(e) ? e.target.value : e;
    this.value = value;
    return $validator.verify(value, this.rules, {
      name: this.name
    }).then(result => {
      this.setFlags({ pending: false });

      return result;
    });
  };

  const validationHandler = e => validate(e).then(({ errors }) => {
    this.messages = errors;
    this.setFlags({
      valid: !errors.length,
      changed: this.value !== this.initialValue,
      invalid: !!errors.length,
      validated: true
    });
  });

  // initially assign the valid/invalid flags.
  if (!this.wasValidatedInitially) {
    if (!this.immediate) {
      validate(this.value).then(({ valid }) => {
        this.setFlags({
          valid,
          invalid: !valid
        });
      });
    } else {
      validationHandler(this.value);
    }

    this.wasValidatedInitially = true;
  }

  const inputHandler = () => {
    this.setFlags({ dirty: true, pristine: false });
  };

  const blurHandler = () => {
    this.setFlags({ touched: true, untouched: false });
  };

  // determine how to add the listener.
  const addListenerFn = node.componentOptions ? addListenerToComponentNode : addListenerToNode;
  // add validation listener.
  addListenerFn(node, eventName, validationHandler);
  // dirty, pristene flags listener.
  addListenerFn(node, eventName, inputHandler);
  // touched, untouched flags listener.
  addListenerFn(node, 'blur', blurHandler);

  return true;
}

export const ValidationProvider = {
  props: {
    name: {
      type: String,
      default: null
    },
    events: {
      type: [Array, String],
      default: () => []
    },
    rules: {
      type: [Object, String],
      default: null
    },
    immediate: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    messages: [],
    value: undefined,
    initialValue: undefined,
    wasValidatedInitially: false,
    flags: createFlags()
  }),
  methods: {
    setFlags (flags) {
      this.flags = assign({}, this.flags, flags);
    }
  },
  computed: {
    classes () {
      let names;
      // TODO: Resolve class names using root-config.
      // const names = VeeValidate.current.classNames;
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
      addListeners.call(this, input); // Temporary setup
    });

    return h('div', nodes);
  }
};
