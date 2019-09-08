import { getConfig } from '../config';
import { validate } from '../validate';
import { RuleContainer } from '../extend';
import { normalizeEventValue } from '../utils/events';
import { createFlags, normalizeRules, isCallable, isEqual, computeClassObj } from '../utils';
import { extractVNodes, resolveRules, normalizeChildren } from '../utils/vnode';
import Vue, { VNode, CreateElement, VueConstructor } from 'vue';
import { ValidationResult, ValidationFlags, VeeObserver, VNodeWithVeeContext, ProviderInstance } from '../types';
import { computeModeSetting, createValidationCtx, addListeners } from './common';

let PROVIDER_COUNTER = 0;

type withProviderPrivates = VueConstructor<
  Vue & {
    $_veeObserver: VeeObserver;
    _needsValidation: boolean;
    _inputEventName: string;
    _ignoreImmediate: boolean;
    _pendingValidation?: Promise<ValidationResult>;
    _resolvedRules: any;
    _veeWatchers: Record<string, Function>;
    $veeDebounce?: number;
    $veeHandler?: Function;
    $vnode: VNodeWithVeeContext;
  }
>;

function data() {
  const messages: string[] = [];

  const defaultValues = {
    messages,
    value: undefined,
    initialized: false,
    initialValue: undefined,
    flags: createFlags(),
    failedRules: {},
    forceRequired: false,
    isDeactivated: false,
    id: ''
  };
  return defaultValues;
}

export const ValidationProvider = (Vue as withProviderPrivates).extend({
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default() {
        if (!this.$vnode.context.$_veeObserver) {
          this.$vnode.context.$_veeObserver = createObserver();
        }

        return this.$vnode.context.$_veeObserver;
      }
    }
  },
  props: {
    vid: {
      type: String,
      default: ''
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
    skipIfEmpty: {
      type: Boolean,
      default: () => getConfig().skipOptional
    },
    debounce: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      default: 'span'
    },
    slim: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    rules: {
      deep: true,
      handler(val: any, oldVal: any) {
        this._needsValidation = !isEqual(val, oldVal);
      }
    }
  },
  data,
  computed: {
    fieldDeps(): string[] {
      return Object.keys(this.normalizedRules)
        .filter(RuleContainer.isTargetRule)
        .reduce((acc: string[], rule: string) => {
          const deps = RuleContainer.getTargetParamNames(rule, this.normalizedRules[rule]);
          acc.push(...deps);
          deps.forEach(depName => {
            watchCrossFieldDep(this, depName);
          });

          return acc;
        }, []);
    },
    normalizedEvents(): string[] {
      const { on } = computeModeSetting(this);

      return (on || []).map(e => {
        if (e === 'input') {
          return this._inputEventName;
        }

        return e;
      });
    },
    isRequired(): boolean {
      const rules = { ...this._resolvedRules, ...this.normalizedRules };
      const forceRequired = this.forceRequired;

      const isRequired = Object.keys(rules).some(RuleContainer.isRequireRule) || forceRequired;
      this.flags.required = !!isRequired;

      return isRequired;
    },
    classes() {
      const names = getConfig().classes;

      return computeClassObj(names, this.flags);
    },
    normalizedRules() {
      return normalizeRules(this.rules);
    }
  },
  render(h: CreateElement): VNode {
    this.registerField();
    const ctx = createValidationCtx(this);
    const children = normalizeChildren(this, ctx);

    // Handle single-root slot.
    extractVNodes(children).forEach(input => {
      this._resolvedRules = getConfig().useConstraintAttrs ? resolveRules(input) : {};
      addListeners(this, input);
    });

    return this.slim && children.length <= 1 ? children[0] : h(this.tag, children);
  },
  beforeDestroy() {
    // cleanup reference.
    this.$_veeObserver.unsubscribe(this.id);
  },
  activated() {
    this.$_veeObserver.subscribe(this);
    this.isDeactivated = false;
  },
  deactivated() {
    this.$_veeObserver.unsubscribe(this.id);
    this.isDeactivated = true;
  },
  methods: {
    setFlags(flags: Partial<ValidationFlags>) {
      Object.keys(flags).forEach(flag => {
        this.flags[flag] = flags[flag];
      });
    },
    syncValue(v: any) {
      const value = normalizeEventValue(v);
      this.value = value;
      this.flags.changed = this.initialValue !== value;
    },
    reset() {
      this.messages = [];
      this.initialValue = this.value;
      const flags = createFlags();
      this.setFlags(flags);
      this.validateSilent();
    },
    async validate(...args: any[]): Promise<ValidationResult> {
      if (args.length > 0) {
        this.syncValue(args[0]);
      }

      const result = await this.validateSilent();
      this.applyResult(result);

      return result;
    },
    async validateSilent(): Promise<ValidationResult> {
      this.setFlags({ pending: true });
      const rules = { ...this._resolvedRules, ...this.normalizedRules };
      Object.defineProperty(rules, '_$$isNormalized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      const result = await validate(this.value, rules, {
        name: this.name,
        values: createValuesLookup(this),
        bails: this.bails,
        skipIfEmpty: this.skipIfEmpty,
        isInitial: !this.initialized
      });

      this.setFlags({ pending: false });
      this.setFlags({ valid: result.valid, invalid: !result.valid });

      return result;
    },
    setErrors(errors: string[]) {
      this.applyResult({ errors, failedRules: {} });
    },
    applyResult({ errors, failedRules }: Omit<ValidationResult, 'valid'>) {
      this.messages = errors;
      this.failedRules = { ...(failedRules || {}) };
      this.setFlags({
        valid: !errors.length,
        changed: this.value !== this.initialValue,
        invalid: !!errors.length,
        validated: true
      });
    },
    registerField() {
      updateRenderingContextRefs(this);
    }
  }
});

function createValuesLookup(vm: ProviderInstance) {
  const providers = vm.$_veeObserver.refs;
  const reduced: Record<string, any> = {};

  return vm.fieldDeps.reduce((acc: typeof reduced, depName: string) => {
    if (!providers[depName]) {
      return acc;
    }

    acc[depName] = providers[depName].value;

    return acc;
  }, reduced);
}

function extractId(vm: ProviderInstance): string {
  if (vm.vid) {
    return vm.vid;
  }

  if (vm.name) {
    return vm.name;
  }

  if (vm.id) {
    return vm.id;
  }

  PROVIDER_COUNTER++;

  return `_vee_${PROVIDER_COUNTER}`;
}

function updateRenderingContextRefs(vm: ProviderInstance) {
  const providedId = extractId(vm);

  const { id } = vm;
  // Nothing has changed.
  if (vm.isDeactivated || (id === providedId && vm.$_veeObserver.refs[id])) {
    return;
  }

  // vid was changed.
  if (id !== providedId && vm.$_veeObserver.refs[id] === vm) {
    vm.$_veeObserver.unsubscribe(id);
  }

  vm.id = providedId;
  vm.$_veeObserver.subscribe(vm);
}

function createObserver(): VeeObserver {
  return {
    refs: {},
    subscribe(vm: ProviderInstance) {
      this.refs[vm.id] = vm;
    },
    unsubscribe(id: string) {
      delete this.refs[id];
    }
  };
}

function watchCrossFieldDep(ctx: ProviderInstance, depName: string, withHooks = true) {
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
}
