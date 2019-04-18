import { getConfig } from '../config';
import { getValidator } from '../state';
import { modes } from '../modes';
import Validator from '../core/validator';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, normalizeEventValue } from '../utils/events';
import { createFlags, normalizeRules, warn, isCallable, debounce, isNullOrUndefined, assign, isEqual, ValidationFlags } from '../utils';
import { findModel, extractVNodes, addVNodeListener, getInputEventName, resolveRules } from '../utils/vnode';
import { VNode, VNodeDirective, CreateElement, ComponentOptions, Component } from 'vue';
import { ValidationResult } from '../types';

let $validator: Validator;

let PROVIDER_COUNTER = 0;

interface ProviderData {
  messages: string[];
  value: any;
  initialized: boolean;
  initialValue: any;
  flags: ValidationFlags;
  failedRules: { [k: string]: string };
  forceRequired: boolean;
  isDeactivated: boolean;
  id: string;
}

export const ValidationProvider: any = {
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
      default: () => getConfig().bails
    },
    debounce: {
      type: Number,
      default: () => getConfig().delay || 0
    },
    tag: {
      type: String,
      default: 'span'
    }
  },
  watch: {
    rules: {
      deep: true,
      handler (val: any, oldVal: any) {
        this._needsValidation = !isEqual(val, oldVal);
      }
    }
  },
  data: (): ProviderData => ({
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
      const providers = this.$_veeObserver.refs;

      return Object.keys(this.normalizedRules).filter(RuleContainer.isTargetRule).map(rule => {
        const depName = this.normalizedRules[rule][0];
        const watcherName = `$__${depName}`;
        if (!isCallable(this[watcherName]) && providers[depName]) {
          this[watcherName] = providers[depName].$watch('value', () => {
            if (this.flags.validated) {
              this._needsValidation = true;
              this.validate();
            }
          });
        }

        return depName;
      });
    },
    normalizedEvents () {
      const { on } = computeModeSetting(this);

      return normalizeEvents(on || []).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired () {
      const rules = assign({}, this._resolvedRules, this.normalizedRules);
      const forceRequired = this.forceRequired;

      const isRequired = rules.required || forceRequired;
      this.flags.required = isRequired;

      return isRequired;
    },
    classes () {
      const names = getConfig().classNames;
      const acc: { [k: string]: any } = {};
      return Object.keys(this.flags).reduce((classes, flag) => {
        const className = (names && names[flag]) || flag;
        if (isNullOrUndefined(this.flags[flag])) {
          return classes;
        }

        if (typeof className === 'string') {
          classes[className] = this.flags[flag];
        } else if (Array.isArray(className)) {
          className.forEach(cls => {
            classes[cls] = this.flags[flag];
          });
        }

        return classes;
      }, acc);
    },
    normalizedRules () {
      return normalizeRules(this.rules);
    }
  },
  render(h: CreateElement): VNode {
    this.registerField();
    const ctx = createValidationCtx(this);

    // Gracefully handle non-existent scoped slots.
    let slot = this.$scopedSlots.default;
    /* istanbul ignore next */
    if (!isCallable(slot)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('ValidationProvider expects a scoped slot. Did you forget to add "slot-scope" to your slot?');
      }

      return h(this.tag, this.$slots.default);
    }

    const nodes = slot(ctx);
    // Handle single-root slot.
    extractVNodes(nodes).forEach(input => {
      this._resolvedRules = resolveRules(input);
      addListeners.call(this, input);
    });

    return h(this.tag, nodes);
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
    setFlags (flags: Partial<ValidationFlags>) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue (v: any) {
      const value = normalizeEventValue(v);
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
    validate(...args: any[]): Promise<ValidationResult> {
      if (args.length > 0) {
        this.syncValue(args[0]);
      }

      return this.validateSilent().then((result: ValidationResult) => {
        this.applyResult(result);

        return result;
      });
    },
    validateSilent(): Promise<ValidationResult> {
      this.setFlags({ pending: true });
      const rules = assign({}, this._resolvedRules, this.normalizedRules);

      return $validator.verify(this.value, rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails,
        isNormalized: true,
        isInitial: !this.initialized
      }).then(result => {
        this.setFlags({ pending: false });
        if (!this.isRequired) {
          this.setFlags({ valid: result.valid, invalid: !result.valid });
        }

        return result;
      });
    },
    applyResult ({ errors, failedRules }: ValidationResult) {
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
        $validator = getValidator() || new Validator({ bails: getConfig().bails });
      }

      updateRenderingContextRefs(this);
    }
  }
};


export function createValidationCtx(ctx: any) {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    valid: ctx.isValid,
    failedRules: ctx.failedRules,
    reset: () => ctx.reset(),
    validate: (...args: any[]) => ctx.validate(...args),
    aria: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false'
    }
  };
}

/**
 * Determines if a provider needs to run validation.
 */
function shouldValidate(ctx: any, model: VNodeDirective) {
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

function computeModeSetting(ctx: any) {
  const compute = isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode];

  return compute({
    errors: ctx.messages,
    value: ctx.value,
    flags: ctx.flags
  });
}

export function onRenderUpdate(model: VNodeDirective) {
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

  this.validateSilent().then(this.immediate || this.flags.validated ? this.applyResult : (x: any) => x);
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers(ctx: any) {
  const onInput = (e: any) => {
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
          const pendingPromise: Promise<ValidationResult> = ctx.validateSilent();
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
function addListeners(node: VNode) {
  const model = findModel(node);
  // cache the input eventName.
  this._inputEventName = this._inputEventName || getInputEventName(node, model);

  onRenderUpdate.call(this, model);

  const { onInput, onBlur, onValidate } = createCommonHandlers(this);
  addVNodeListener(node, this._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  this.normalizedEvents.forEach((evt: string) => {
    addVNodeListener(node, evt, onValidate);
  });

  this.initialized = true;
}

function createValuesLookup(ctx: any) {
  let providers = ctx.$_veeObserver.refs;
  const reduced: { [k: string]: any } = {};

  return ctx.fieldDeps.reduce((acc: typeof reduced, depName: string) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, reduced);
}

function updateRenderingContextRefs(ctx: any) {
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
    ctx.$_veeObserver.unsubscribe(ctx);
  }

  ctx.$_veeObserver.subscribe(ctx);
  ctx.id = vid;
}

function createObserver() {
  return {
    refs: {},
    subscribe(ctx: any) {
      this.refs[ctx.vid] = ctx;
    },
    unsubscribe(ctx: any) {
      delete this.refs[ctx.vid];
    }
  };
}
