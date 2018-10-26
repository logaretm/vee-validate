import VeeValidate from '../plugin';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, isEvent } from '../utils/events';
import { createFlags, assign, isCallable, normalizeRules, warn } from '../utils';
import { findModel, findModelNodes, findModelConfig, addListenerToVNode, addListenerToObject, getInputEventName, normalizeSlots } from '../utils/vnode';

let $validator = null;

function createValidationCtx (ctx) {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    get valid () {
      return ctx.isValid;
    },
    aria: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false'
    }
  };
}

function onRenderUpdate (model) {
  let validateNow = this.value !== model.value || this._needsValidation;
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

    this.syncValue(model.value);
    this.validate().then(this.immediate || shouldRevalidate ? this.applyResult : silentHandler);
  }

  this._needsValidation = false;
}

// Adds all plugin listeners to the vnode.
function addListeners (node) {
  const model = findModel(node);
  // cache the input eventName.
  this._inputEventName = this._inputEventName || getInputEventName(node, model);

  onRenderUpdate.call(this, model);

  const onInput = (e) => {
    // track and keep the value updated.
    this.syncValue(e);
    // set the flags.
    this.setFlags({ dirty: true, pristine: false });
  };

  addListenerToVNode(node, this._inputEventName, onInput);

  // add the validation listeners.
  this.normalizedEvents.forEach(evt => {
    addListenerToVNode(node, evt, () => this.validate().then(this.applyResult));
  });

  // touched, untouched flags listener.
  const setFlagsAfterBlur = () => {
    this.setFlags({ touched: true, untouched: false });
  };

  addListenerToVNode(node, 'blur', setFlagsAfterBlur);

  this.initialized = true;
}

function createValuesLookup (ctx) {
  let providers = ctx.$parent.$_veeObserver.refs;

  return ctx.fieldDeps.reduce((acc, depName) => {
    if (providers[depName]) {
      acc[depName] = providers[depName].value;
      const unwatch = providers[depName].$watch('value', () => {
        ctx.validate(ctx.value).then(ctx.applyResult);
        unwatch();
      });
    }

    return acc;
  }, {});
}

function updateRenderingContextRefs (ctx) {
  const { id, vid } = ctx;

  // Nothing has changed.
  if (id === vid && ctx.$_veeObserver.refs[id]) {
    return;
  }

  // vid was changed.
  if (id !== vid && ctx.$_veeObserver.refs[id] === ctx) {
    ctx.$_veeObserver.$unsubscribe(ctx);
  }

  ctx.$_veeObserver.$subscribe(ctx);
  ctx.id = vid;
}

function createObserver () {
  return {
    refs: {},
    $subscribe (ctx) {
      this.refs[ctx.vid] = ctx;
    },
    $unsubscribe (ctx) {
      delete this.refs[ctx.vid];
    }
  };
}

let id = 0;

export const ValidationProvider = {
  $__veeInject: false,
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default () {
        if (!this.$vnode.context.$_veeObserver) {
          this.$vnode.context.$_veeObserver = createObserver();
        }

        return this.$vnode.context.$_veeObserver;
      }
    }
  },
  props: {
    vid: {
      type: [String, Number],
      default: () => {
        id++;
        return id;
      }
    },
    name: {
      type: String,
      default: null
    },
    events: {
      type: [Array, String],
      default: () => ['input']
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
  watch: {
    rules: {
      deep: true,
      handler () {
        this._needsValidation = true;
      }
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
    syncValue (e) {
      const value = isEvent(e) ? e.target.value : e;

      this.value = value;
    },
    validate () {
      this.setFlags({ pending: true });

      return $validator.verify(this.value, this.rules, {
        name: this.name,
        values: createValuesLookup(this)
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
      if (!$validator) {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
          if (!VeeValidate.instance) {
            warn('You must install vee-validate first before using this component.');
          }
        }

        $validator = VeeValidate.instance._validator;
      }

      updateRenderingContextRefs(this);
    }
  },
  computed: {
    isValid () {
      return this.flags.valid;
    },
    fieldDeps () {
      const rules = normalizeRules(this.rules);

      return Object.keys(rules).filter(RuleContainer.isTargetRule).map(rule => {
        return rules[rule][0];
      });
    },
    normalizedEvents () {
      return normalizeEvents(this.events).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired () {
      const rules = normalizeRules(this.rules);

      return !!rules.required;
    },
    classes () {
      const names = VeeValidate.config.classNames;
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
    this.registerField();
    const ctx = createValidationCtx(this);

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
    // cleanup reference.
    this.$_veeObserver.$unsubscribe(this);
  },
  // Creates an HoC with validation capablities.
  wrap (component, ctxToProps = null) {
    const options = isCallable(component) ? component.options : component;
    options.$__veeInject = false;
    const hoc = {
      name: `${options.name || 'AnonymousHoc'}WithValidation`,
      props: assign({}, this.props),
      data: this.data,
      computed: assign({}, this.computed),
      methods: assign({}, this.methods),
      $__veeInject: false,
      inject: this.inject
    };

    // Default ctx converts ctx props to component props.
    if (!ctxToProps) {
      ctxToProps = ctx => ctx;
    }

    const eventName = (options.model && options.model.event) || 'input';

    hoc.render = function (h) {
      this.registerField();
      const vctx = createValidationCtx(this);
      const listeners = assign({}, this.$listeners);

      const model = findModel(this.$vnode);
      this._inputEventName = this._inputEventName || getInputEventName(this.$vnode, model);
      onRenderUpdate.call(this, model);

      addListenerToObject(listeners, eventName, (e) => {
        this.syncValue(e);
        this.setFlags({ dirty: true, pristine: false });
      });

      this.normalizedEvents.forEach((evt, idx) => {
        addListenerToObject(listeners, evt, (e) => {
          this.validate().then(this.applyResult);
        });
      });

      addListenerToObject(listeners, 'blur', () => {
        this.setFlags({ touched: true, untouched: false });
      });

      // Props are any attrs not associated with ValidationProvider Plus the model prop.
      // WARNING: Accidental prop overwrite will probably happen.
      const { prop } = findModelConfig(this.$vnode) || { prop: 'value' };
      const props = assign({}, this.$attrs, { [prop]: model.value }, ctxToProps(vctx));

      return h(options, {
        attrs: this.$attrs,
        props,
        on: listeners
      }, normalizeSlots(this.$slots, this.$vnode.context));
    };

    return hoc;
  }
};
