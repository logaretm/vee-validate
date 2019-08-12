import { getConfig } from '../config';
import { getValidator } from '../state';
import { modes } from '../modes';
import Validator from '../core/validator';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, isEvent } from '../utils/events';
import { createFlags, normalizeRules, warn, isCallable, debounce, isNullOrUndefined, assign, isEqual, toArray } from '../utils';
import { findModel, extractVNodes, addVNodeListener, getInputEventName, createRenderless } from '../utils/vnode';

let $validator = null;

let PROVIDER_COUNTER = 0;

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
        PROVIDER_COUNTER++;

        return `_vee_${PROVIDER_COUNTER}`;
      }
    },
    name: {
      type: String,
      default: null
    },
    mode: {
      type: [String, Function],
      default: () => {
        return getConfig().mode;
      }
    },
    events: {
      type: Array,
      validate: () => {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
          warn('events prop and config will be deprecated in future version please use the interaction modes instead');
        }

        return true;
      },
      default: () => {
        const events = getConfig().events;
        if (typeof events === 'string') {
          return events.split('|');
        }

        return events;
      }
    },
    rules: {
      type: [Object, String],
      default: null
    },
    immediate: {
      type: Boolean,
      default: false
    },
    persist: {
      type: Boolean,
      default: false
    },
    bails: {
      type: Boolean,
      default: () => getConfig().fastExit
    },
    debounce: {
      type: Number,
      default: () => getConfig().delay || 0
    },
    tag: {
      type: String,
      default: 'span'
    },
    slim: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rules: {
      deep: true,
      handler (val, oldVal) {
        this._needsValidation = !isEqual(val, oldVal);
      }
    }
  },
  data: () => ({
    messages: [],
    value: undefined,
    initialized: false,
    initialValue: undefined,
    flags: createFlags(),
    failedRules: {},
    forceRequired: false,
    isDeactivated: false,
    id: null
  }),
  computed: {
    isValid () {
      return this.flags.valid;
    },
    fieldDeps () {
      const rules = normalizeRules(this.rules);

      return Object.keys(rules).filter(RuleContainer.isTargetRule).map(rule => {
        const depName = rules[rule][0];
        watchCrossFieldDep(this, depName);

        return depName;
      });
    },
    normalizedEvents () {
      const { on } = computeModeSetting(this);

      return normalizeEvents(on || this.events || []).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired () {
      const rules = normalizeRules(this.rules);
      const forceRequired = this.forceRequired;

      const isRequired = rules.required || forceRequired;
      this.flags.required = isRequired;

      return isRequired;
    },
    classes () {
      const names = getConfig().classNames;
      return Object.keys(this.flags).reduce((classes, flag) => {
        const className = (names && names[flag]) || flag;
        if (isNullOrUndefined(this.flags[flag])) {
          return classes;
        }

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

    // Gracefully handle non-existent scoped slots.
    const slot = this.$scopedSlots.default;
    /* istanbul ignore next */
    if (!isCallable(slot)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('ValidationProvider expects a scoped slot. Did you forget to add "v-slot" to your slot?');
      }

      return h(this.tag, this.$slots.default);
    }

    const nodes = slot(ctx);
    // Handle single-root slot.
    extractVNodes(nodes).forEach(input => {
      addListeners.call(this, input);
    });

    return this.slim ? createRenderless(h, nodes) : h(this.tag, nodes);
  },
  beforeDestroy () {
    // cleanup reference.
    this.$_veeObserver.unsubscribe(this);
  },
  activated () {
    this.$_veeObserver.subscribe(this);
    this.isDeactivated = false;
  },
  deactivated () {
    this.$_veeObserver.unsubscribe(this);
    this.isDeactivated = true;
  },
  methods: {
    setFlags (flags) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue (e) {
      const value = normalizeValue(e);
      this.value = value;
      this.flags.changed = this.initialValue !== value;
    },
    reset () {
      this.messages = [];
      this._pendingValidation = null;
      this.initialValue = this.value;
      const flags = createFlags();
      this.setFlags(flags);
    },
    validate (...args) {
      if (args.length > 0) {
        this.syncValue(args[0]);
      }

      return this.validateSilent().then(result => {
        this.applyResult(result);

        return result;
      });
    },
    validateSilent () {
      this.setFlags({ pending: true });

      return $validator.verify(this.value, this.rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails
      }).then(result => {
        this.setFlags({ pending: false });
        if (!this.isRequired) {
          this.setFlags({ valid: result.valid, invalid: !result.valid });
        }

        return result;
      });
    },
    applyResult ({ errors, failedRules }) {
      this.messages = errors;
      this.failedRules = assign({}, failedRules);
      this.setFlags({
        valid: !errors.length,
        changed: this.value !== this.initialValue,
        invalid: !!errors.length,
        validated: true
      });
    },
    registerField () {
      if (!$validator) {
        $validator = getValidator() || new Validator(null, { fastExit: getConfig().fastExit });
      }

      updateRenderingContextRefs(this);
    }
  }
};

export function createValidationCtx (ctx) {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    valid: ctx.isValid,
    failedRules: ctx.failedRules,
    reset: () => ctx.reset(),
    validate: (...args) => ctx.validate(...args),
    aria: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false'
    }
  };
}

function normalizeValue (value) {
  if (isEvent(value)) {
    return value.target.type === 'file' ? toArray(value.target.files) : value.target.value;
  }

  return value;
}

/**
 * Determines if a provider needs to run validation.
 */
function shouldValidate (ctx, model) {
  // when an immediate/initial validation is needed and wasn't done before.
  if (!ctx._ignoreImmediate && ctx.immediate) {
    return true;
  }

  // when the value changes for whatever reason.
  if (ctx.value !== model.value) {
    return true;
  }

  // when it needs validation due to props/cross-fields changes.
  if (ctx._needsValidation) {
    return true;
  }

  // when the initial value is undefined and the field wasn't rendered yet.
  if (!ctx.initialized && model.value === undefined) {
    return true;
  }

  return false;
}

function computeModeSetting (ctx) {
  const compute = isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode];

  return compute({
    errors: ctx.messages,
    value: ctx.value,
    flags: ctx.flags
  });
}

export function onRenderUpdate (model) {
  if (!this.initialized) {
    this.initialValue = model.value;
  }

  const validateNow = shouldValidate(this, model);
  this._needsValidation = false;
  this.value = model.value;
  this._ignoreImmediate = true;

  if (!validateNow) {
    return;
  }

  this.validateSilent().then(this.immediate || this.flags.validated ? this.applyResult : x => x);
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers (ctx) {
  const onInput = (e) => {
    ctx.syncValue(e); // track and keep the value updated.
    ctx.setFlags({ dirty: true, pristine: false });
  };

  // Blur event listener.
  const onBlur = () => {
    ctx.setFlags({ touched: true, untouched: false });
  };

  let onValidate = ctx.$veeHandler;
  const mode = computeModeSetting(ctx);

  // Handle debounce changes.
  if (!onValidate || ctx.$veeDebounce !== ctx.debounce) {
    onValidate = debounce(
      () => {
        ctx.$nextTick(() => {
          const pendingPromise = ctx.validateSilent();
          // avoids race conditions between successive validations.
          ctx._pendingValidation = pendingPromise;
          pendingPromise.then(result => {
            if (pendingPromise === ctx._pendingValidation) {
              ctx.applyResult(result);
              ctx._pendingValidation = null;
            }
          });
        });
      },
      mode.debounce || ctx.debounce
    );

    // Cache the handler so we don't create it each time.
    ctx.$veeHandler = onValidate;
    // cache the debounce value so we detect if it was changed.
    ctx.$veeDebounce = ctx.debounce;
  }

  return { onInput, onBlur, onValidate };
}

// Adds all plugin listeners to the vnode.
function addListeners (node) {
  const model = findModel(node);
  // cache the input eventName.
  this._inputEventName = this._inputEventName || getInputEventName(node, model);

  onRenderUpdate.call(this, model);

  const { onInput, onBlur, onValidate } = createCommonHandlers(this);
  addVNodeListener(node, this._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  this.normalizedEvents.forEach(evt => {
    addVNodeListener(node, evt, onValidate);
  });

  this.initialized = true;
}

function createValuesLookup (ctx) {
  const providers = ctx.$_veeObserver.refs;

  return ctx.fieldDeps.reduce((acc, depName) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, {});
}

function updateRenderingContextRefs (ctx) {
  // IDs should not be nullable.
  if (isNullOrUndefined(ctx.id) && ctx.id === ctx.vid) {
    ctx.id = PROVIDER_COUNTER;
    PROVIDER_COUNTER++;
  }

  const { id, vid } = ctx;
  // Nothing has changed.
  if (ctx.isDeactivated || (id === vid && ctx.$_veeObserver.refs[id])) {
    return;
  }

  // vid was changed.
  if (id !== vid && ctx.$_veeObserver.refs[id] === ctx) {
    ctx.$_veeObserver.unsubscribe({ vid: id });
  }

  ctx.$_veeObserver.subscribe(ctx);
  ctx.id = vid;
}

function createObserver () {
  return {
    refs: {},
    subscribe (ctx) {
      this.refs[ctx.vid] = ctx;
    },
    unsubscribe (ctx) {
      delete this.refs[ctx.vid];
    }
  };
}

function watchCrossFieldDep (ctx, depName, withHooks = true) {
  const providers = ctx.$_veeObserver.refs;
  if (!ctx._veeWatchers) {
    ctx._veeWatchers = {};
  }

  if (!providers[depName] && withHooks) {
    return ctx.$once('hook:mounted', () => {
      watchCrossFieldDep(ctx, depName, false);
    });
  }

  if (!isCallable(ctx._veeWatchers[depName]) && providers[depName]) {
    ctx._veeWatchers[depName] = providers[depName].$watch('value', () => {
      if (ctx.flags.validated) {
        ctx._needsValidation = true;
        ctx.validate();
      }
    });
  }
};
