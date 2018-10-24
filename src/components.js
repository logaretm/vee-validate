import VeeValidate from './plugin';
import Validator from './core/validator';
import RuleContainer from './core/ruleContainer';
import { normalizeEvents, isEvent } from './utils/events';
import { createFlags, assign, isCallable, normalizeRules, warn } from './utils';
import { findModel, findModelNodes, findModelConfig, addListenerToVNode, addListenerToObject, getInputEventName, normalizeSlots } from './utils/vnode';

let $validator = null;

function createValidationCtx (ctx) {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    aria: {
      'aria-invalid': ctx.flags.invalid,
      'aria-required': ctx.flags.required
    }
  };
}

function onRenderUpdate (model) {
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

    this.syncValue(model.value);
    this.validate().then(this.immediate || shouldRevalidate ? this.applyResult : silentHandler);
  }
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

let id = 0;

export const ValidationProvider = {
  $__veeInject: false,
  props: {
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
    // cache the default input event.
    if (!$validator) {
      $validator = new Validator(null);
    }

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
    if (!this.id) {
      return;
    }

    // cleanup reference.
    delete this.$parent.$_veeValidate[this.id];
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
      $__veeInject: false
    };

    // Default ctx converts ctx props to component props.
    if (!ctxToProps) {
      ctxToProps = ctx => ctx;
    }

    const eventName = (options.model && options.model.event) || 'input';

    hoc.render = function (h) {
      if (!$validator) {
        $validator = new Validator(null);
      }

      this.registerField();
      const vctx = createValidationCtx(this);
      const listeners = assign({}, this.$listeners);

      const model = findModel(this.$vnode);
      this._inputEventName = this._inputEventName || getInputEventName(this.$vnode, model);
      onRenderUpdate.call(this, model);
      addListenerToObject(listeners, eventName, (e) => {
        this.syncValue(e);
      });
      this.normalizedEvents.forEach((evt, idx) => {
        addListenerToObject(listeners, evt, (e) => {
          this.validate().then(this.applyResult);
        });
      });

      // Props are any attrs not associated with ValidationProvider Plus the model prop.
      // WARNING: Accidental prop overwrite will probably happen.
      const { prop } = findModelConfig(this.$vnode);
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
