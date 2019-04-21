import { getConfig, ValidationClassMap } from '../config';
import { getValidator } from '../state';
import { modes } from '../modes';
import Validator from '../core/validator';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, normalizeEventValue } from '../utils/events';
import { createFlags, normalizeRules, warn, isCallable, debounce, isNullOrUndefined, assign, isEqual } from '../utils';
import { findModel, extractVNodes, addVNodeListener, getInputEventName, resolveRules } from '../utils/vnode';
import { VNode, VNodeDirective, CreateElement, Component } from 'vue';
import { ValidationResult, ValidationFlags } from '../types';

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
      default(this: any) {
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
      handler(this: any, val: any, oldVal: any) {
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
    id: ''
  }),
  computed: {
    isValid(this: any): boolean {
      return this.flags.valid;
    },
    fieldDeps(this: any): { [k: string]: any } {
      const providers = this.$_veeObserver.refs;

      return Object.keys(this.normalizedRules)
        .filter(RuleContainer.isTargetRule)
        .map(rule => {
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
    normalizedEvents(this: any): string[] {
      const { on } = computeModeSetting(this);

      return normalizeEvents(on || []).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired(this: any): boolean {
      const rules = assign({}, this._resolvedRules, this.normalizedRules);
      const forceRequired = this.forceRequired;

      const isRequired = rules.required || forceRequired;
      this.flags.required = isRequired;

      return isRequired;
    },
    classes(this: any): ValidationClassMap {
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
    normalizedRules(this: any) {
      return normalizeRules(this.rules);
    }
  },
  render(h: CreateElement): VNode {
    this.registerField(this);
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
      addListeners(this, input);
    });

    return h(this.tag, nodes);
  },
  beforeDestroy() {
    // cleanup reference.
    this.$_veeObserver.unsubscribe(this);
  },
  activated() {
    this.$_veeObserver.subscribe(this);
    this.isDeactivated = false;
  },
  deactivated() {
    this.$_veeObserver.unsubscribe(this);
    this.isDeactivated = true;
  },
  methods: {
    setFlags(this: any, flags: Partial<ValidationFlags>) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue(this: any, v: any) {
      const value = normalizeEventValue(v);
      this.value = value;
      this.flags.changed = this.initialValue !== value;
    },
    reset(this: any) {
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
    validateSilent(this: any): Promise<ValidationResult> {
      this.setFlags({ pending: true });
      const rules = assign({}, this._resolvedRules, this.normalizedRules);

      return $validator
        .validate(this.value, rules, {
          name: this.name,
          values: createValuesLookup(this),
          bails: this.bails,
          isNormalized: true,
          isInitial: !this.initialized
        })
        .then(result => {
          this.setFlags({ pending: false });
          if (!this.isRequired) {
            this.setFlags({ valid: result.valid, invalid: !result.valid });
          }

          return result;
        });
    },
    applyResult(this: any, { errors, failedRules }: ValidationResult) {
      this.messages = errors;
      this.failedRules = assign({}, failedRules);
      this.setFlags({
        valid: !errors.length,
        changed: this.value !== this.initialValue,
        invalid: !!errors.length,
        validated: true
      });
    },
    registerField() {
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

export function onRenderUpdate(vm: any, model: VNodeDirective) {
  if (!vm.initialized) {
    vm.initialValue = model.value;
  }

  const validateNow = shouldValidate(vm, model);
  vm._needsValidation = false;
  vm.value = model.value;
  vm._ignoreImmediate = true;

  if (!validateNow) {
    return;
  }

  vm.validateSilent().then(vm.immediate || vm.flags.validated ? vm.applyResult : (x: any) => x);
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers(vm: any) {
  const onInput = (e: any) => {
    vm.syncValue(e); // track and keep the value updated.
    vm.setFlags({ dirty: true, pristine: false });
  };

  // Blur event listener.
  const onBlur = () => {
    vm.setFlags({ touched: true, untouched: false });
  };

  let onValidate = vm.$veeHandler;
  const mode = computeModeSetting(vm);

  // Handle debounce changes.
  if (!onValidate || vm.$veeDebounce !== vm.debounce) {
    onValidate = debounce(() => {
      vm.$nextTick(() => {
        const pendingPromise: Promise<ValidationResult> = vm.validateSilent();
        // avoids race conditions between successive validations.
        vm._pendingValidation = pendingPromise;
        // tslint:disable-next-line
        pendingPromise.then(result => {
          if (pendingPromise === vm._pendingValidation) {
            vm.applyResult(result);
            vm._pendingValidation = null;
          }
        });
      });
    }, mode.debounce || vm.debounce);

    // Cache the handler so we don't create it each time.
    vm.$veeHandler = onValidate;
    // cache the debounce value so we detect if it was changed.
    vm.$veeDebounce = vm.debounce;
  }

  return { onInput, onBlur, onValidate };
}

// Adds all plugin listeners to the vnode.
function addListeners(vm: any, node: VNode) {
  const model = findModel(node);
  // cache the input eventName.
  vm._inputEventName = vm._inputEventName || getInputEventName(node, model);

  onRenderUpdate(vm, model);

  const { onInput, onBlur, onValidate } = createCommonHandlers(vm);
  addVNodeListener(node, vm._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  vm.normalizedEvents.forEach((evt: string) => {
    addVNodeListener(node, evt, onValidate);
  });

  vm.initialized = true;
}

function createValuesLookup(vm: any) {
  let providers = vm.$_veeObserver.refs;
  const reduced: { [k: string]: any } = {};

  return vm.fieldDeps.reduce((acc: typeof reduced, depName: string) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, reduced);
}

function updateRenderingContextRefs(vm: any) {
  // IDs should not be nullable.
  if (isNullOrUndefined(vm.id) && vm.id === vm.vid) {
    vm.id = PROVIDER_COUNTER;
    PROVIDER_COUNTER++;
  }

  const { id, vid } = vm;
  // Nothing has changed.
  if (vm.isDeactivated || (id === vid && vm.$_veeObserver.refs[id])) {
    return;
  }

  // vid was changed.
  if (id !== vid && vm.$_veeObserver.refs[id] === vm) {
    vm.$_veeObserver.unsubscribe(vm);
  }

  vm.$_veeObserver.subscribe(vm);
  vm.id = vid;
}

interface ProviderObserverStub {
  refs: { [k: string]: any };
  subscribe(provider: any): void;
  unsubscribe(provider: any): void;
}

function createObserver(): ProviderObserverStub {
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
