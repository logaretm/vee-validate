import { getConfig } from '../config';
import { getValidator } from '../state';
import Validator from '../core/validator';
import RuleContainer from '../core/ruleContainer';
import { normalizeEvents, normalizeEventValue } from '../utils/events';
import { createFlags, normalizeRules, warn, isCallable, isNullOrUndefined, isEqual, computeClassObj } from '../utils';
import { findModel, extractVNodes, addVNodeListener, getInputEventName, resolveRules } from '../utils/vnode';
import { VNode, CreateElement } from 'vue';
import { ValidationResult, ValidationFlags, VeeObserver } from '../types';
import { onRenderUpdate, computeModeSetting, createValidationCtx, createCommonHandlers } from './common';

let $validator: Validator;

let PROVIDER_COUNTER = 0;

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
  data: () => ({
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
      const rules = { ...this._resolvedRules, ...this.normalizedRules };
      const forceRequired = this.forceRequired;

      const isRequired = rules.required || forceRequired;
      this.flags.required = isRequired;

      return isRequired;
    },
    classes(this: any) {
      const names = getConfig().classNames;

      return computeClassObj(names, this.flags);
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
    async validate(...args: any[]): Promise<ValidationResult> {
      if (args.length > 0) {
        this.syncValue(args[0]);
      }

      const result = await this.validateSilent();
      this.applyResult(result);

      return result;
    },
    async validateSilent(this: any): Promise<ValidationResult> {
      this.setFlags({ pending: true });
      const rules = { ...this._resolvedRules, ...this.normalizedRules };

      const result = await $validator.validate(this.value, rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails,
        isNormalized: true,
        isInitial: !this.initialized
      });

      this.setFlags({ pending: false });
      if (!this.isRequired) {
        this.setFlags({ valid: result.valid, invalid: !result.valid });
      }

      return result;
    },
    applyResult(this: any, { errors, failedRules }: ValidationResult) {
      this.messages = errors;
      this.failedRules = { ...failedRules };
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

function createObserver(): VeeObserver {
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
