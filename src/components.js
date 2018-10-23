import Validator from './core/validator';
import { createFlags, assign, isCallable, toArray, isNullOrUndefined, isTextInput, isEvent, normalizeRules, warn } from './utils';
import { findModel } from './utils/vnode';
import RuleContainer from './core/ruleContainer';

let $validator = null;

// Resolves v-model config if exists.
function findModelConfig (vnode) {
  if (!vnode.componentOptions) return null;

  return assign({}, { event: 'input', prop: 'value' }, vnode.componentOptions.Ctor.options.model);
}

// Finds nodes that have v-model bound to it.
function findModelNodes (vnode) {
  if (findModel(vnode)) {
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

// Adds a listener to vnode listener object.
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

// Adds a listener to a native HTML vnode.
function addListenerToHTMLNode (node, eventName, handler) {
  if (isNullOrUndefined(node.data.on)) {
    node.data.on = {};
  }

  addListenerToListenersObject(node.data.on, eventName, handler);
}

// Adds a listener to a Vue component vnode.
function addListenerToComponentNode (node, eventName, handler) {
  if (!node.componentOptions.listeners) {
    node.componentOptions.listeners = {};
  }

  const { event } = findModelConfig(node) || { event: eventName, prop: 'value' };
  addListenerToListenersObject(node.componentOptions.listeners, event, handler);
}

// Determines if `change` should be used over `input` for listeners.
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
  if (vnode.data.attrs && isTextInput({ type: vnode.data.attrs.type || 'text' })) {
    return false;
  }

  return true;
}

function onRenderUpdate (model) {
  if (!model) {
    return;
  }

  let validateNow = this.value !== model.value;
  let shouldRevalidate = this.flags.validated;
  if (!this.initialized) {
    this.initialValue = model.value;
  }

  if (validateNow) {
    const silentHandler = ({ valid }) => {
      // initially assign the valid/invalid flags.
      this.setFlags({
        valid,
        invalid: !valid
      });
    };

    this.validate(model.value).then(this.immediate || shouldRevalidate ? this.applyResult : silentHandler);
  }
}

// Adds all plugin listeners to the vnode.
function addListeners (node) {
  const model = findModel(node);
  const eventName = shouldUseOnChange(node, model) ? 'change' : 'input';
  onRenderUpdate.call(this, model);
  // dirty, pristene flags listener.
  const setFlagsAfterInput = () => {
    this.setFlags({ dirty: true, pristine: false });
  };

  // touched, untouched flags listener.
  const setFlagsAfterBlur = () => {
    this.setFlags({ touched: true, untouched: false });
  };

  // determine how to add the listener.
  const addListenerToNode = node.componentOptions ? addListenerToComponentNode : addListenerToHTMLNode;
  // add validation listener.
  addListenerToNode(node, eventName, e => this.validate(e).then(this.applyResult));
  addListenerToNode(node, eventName, setFlagsAfterInput);
  addListenerToNode(node, 'blur', setFlagsAfterBlur);

  this.initialized = true;
}

let id = 0;

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
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  data: () => ({
    messages: [],
    value: undefined,
    initialized: false,
    initialValue: undefined,
    flags: createFlags(),
    id: null
  }),
  methods: {
    setFlags (flags) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    validate (e) {
      this.setFlags({ pending: true });
      const value = isEvent(e) ? e.target.value : e;
      this.value = value;

      return $validator.verify(value, this.rules, {
        name: this.name,
        values: this.values
      }).then(result => {
        this.setFlags({ pending: false });

        return result;
      });
    },
    applyResult ({ errors }) {
      this.messages = errors;
      this.setFlags({
        valid: !errors.length,
        changed: this.value !== this.initialValue,
        invalid: !!errors.length,
        validated: true
      });
    },
    registerField () {
      if (this.id) {
        return;
      }

      if (!this.$parent.$_veeValidate) {
        this.$parent.$_veeValidate = {};
      }

      this.id = this.name || id++;

      this.$parent.$_veeValidate[this.id] = this;
    }
  },
  computed: {
    fieldDeps () {
      const rules = normalizeRules(this.rules);

      return Object.keys(rules).filter(RuleContainer.isTargetRule).map(rule => {
        return rules[rule][0];
      });
    },
    isRequired () {
      const rules = normalizeRules(this.rules);

      return !!rules.required;
    },
    values () {
      let providers = this.$parent.$_veeValidate;

      return this.fieldDeps.reduce((acc, depName) => {
        if (providers[depName]) {
          acc[depName] = providers[depName].value;
          const unwatch = providers[depName].$watch('value', () => {
            this.validate(this.value).then(this.applyResult);
            unwatch();
          });
        }

        return acc;
      }, {});
    },
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

    this.registerField();

    const ctx = {
      errors: this.messages,
      flags: this.flags,
      classes: this.classes,
      aria: {
        'aria-invalid': this.flags.invalid,
        'aria-required': this.flags.required
      }
    };

    // Graceful handle no scoped slots.
    if (!this.$scopedSlots.default) {
      if (process.env.NODE_ENV !== 'production') {
        warn('ValidationProvider needs a scoped slot to work properly.');
      }

      return h(this.tag);
    }

    const nodes = this.$scopedSlots.default(ctx);
    // Handle multi-root slot.
    const inputs = findModelNodes(Array.isArray(nodes) ? { children: nodes } : nodes);
    // Add the listener on the vnode
    inputs.forEach(input => {
      addListeners.call(this, input);
    });

    return h(this.tag, nodes);
  },
  beforeDestroy () {
    if (!this.id) {
      return;
    }

    // cleanup reference.
    delete this.$parent.$_veeValidate[this.id];
  },
  // Creates an HoC with validation capablities.
  wrap (component, ctxToProps = null) {
    const options = isCallable(component) ? component.options : component;
    const hoc = {
      name: `${options.name || 'AnonymousHoc'}WithValidation`,
      props: assign({}, (options.props || {}), this.props),
      data: this.data,
      computed: assign({}, this.computed),
      methods: assign({}, this.methods),
    };

    const eventName = (options.model && options.model.event) || 'input';
    const veeProps = this.props;
    hoc.render = function (h) {
      if (!$validator) {
        $validator = new Validator(null);
      }

      this.registerField();
      const vctx = {
        errors: this.messages,
        flags: this.flags,
        classes: this.classes,
        aria: {
          'aria-invalid': this.flags.invalid,
          'aria-required': this.flags.required
        }
      };

      // Default ctx converts them to props.
      if (!ctxToProps) {
        ctxToProps = ctx => ctx;
      }

      const listeners = assign({}, this.$listeners);
      addListenerToListenersObject(listeners, eventName, (e) => {
        this.validate(e).then(this.applyResult);
      });

      const getProps = function (props) {
        return Object.keys(props).reduce((newProps, key) => {
          if (!veeProps[key]) {
            newProps[key] = props[key];
          }

          return newProps;
        }, {});
      };

      onRenderUpdate.call(this, findModel(this.$vnode));

      const props = assign(getProps(this.$props), this.$attrs, ctxToProps(vctx));
      return h(options, {
        attrs: this.$attrs,
        props,
        on: listeners
      }, this.$children || []);
    };

    return hoc;
  }
};
