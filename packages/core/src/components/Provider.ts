import {
  ref,
  Ref,
  reactive,
  inject,
  computed,
  SetupContext,
  onBeforeUnmount,
  toRefs,
  onActivated,
  onDeactivated,
  VNode,
  nextTick
} from 'vue';
import { modes, InteractionModeFactory } from '../modes';
import { normalizeRules, extractLocators } from '../utils/rules';
import { normalizeEventValue } from '../utils/events';
import {
  extractVNodes,
  normalizeChildren,
  resolveRules,
  isHTMLNode,
  findValue,
  findModel,
  getInputEventName,
  addVNodeListener
} from '../utils/vnode';
import { isCallable, isEqual, isNullOrUndefined, createFlags } from '../utils';
import { getConfig, ValidationClassMap } from '../config';
import { validate } from '../validate';
import { RuleContainer } from '../extend';
import { ProviderInstance, ValidationFlags, ValidationResult, VeeObserver } from '../types';

let PROVIDER_COUNTER = 0;

interface ProviderProps {
  vid: string | undefined;
  name: string | undefined;
  mode: string | Function;
  rules: Record<string, any> | string;
  immediate: boolean;
  bails: boolean;
  skipIfEmpty: boolean;
  debounce: number;
  disabled: boolean;
  customMessages: Record<string, string>;
}

export const ValidationProvider = {
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
    disabled: {
      type: Boolean,
      default: false
    },
    customMessages: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(props: ProviderProps, ctx: SetupContext) {
    const $observer: VeeObserver = inject('$_veeObserver', createObserver());
    const errors: Ref<string[]> = ref([]);
    const value: Ref<any> = ref(undefined);
    const failedRules: Ref<Record<string, string>> = ref({});
    const flags = reactive(createFlags());
    let initialValue: any;
    let fieldName = '';
    // eslint-disable-next-line prefer-const
    let inputEvtName = '';
    let initialized = false;
    let isActive = false;
    let id = '';
    let resolvedRules = {};
    let needsValidation = false;

    const normalizedRules = computed(() => {
      return normalizeRules(props.rules);
    });

    const fieldDeps = computed(() => {
      return Object.keys(normalizedRules).reduce((acc: string[], rule: string) => {
        const deps = extractLocators(normalizedRules.value[rule]).map((dep: any) => dep.__locatorRef);

        acc.push(...deps);

        return acc;
      }, []);
    });

    const interactionMode = computed(() => {
      const computeModeSetting = (isCallable(props.mode) ? props.mode : modes[props.mode]) as InteractionModeFactory;

      return computeModeSetting({
        errors: errors.value,
        flags,
        value: value.value
      });
    });

    const normalizedEvents = computed(() => {
      const { on } = interactionMode.value;

      return (on || []).map(e => {
        if (e === 'input') {
          return inputEvtName;
        }

        return e;
      });
    });

    const isRequired = computed(() => {
      const rules = { ...resolvedRules, ...normalizedRules.value };

      const isRequired = Object.keys(rules).some(RuleContainer.isRequireRule);
      flags.required = !!isRequired;

      return isRequired;
    });

    const classes = computed(() => {
      const names = getConfig().classes;
      const acc: Record<string, boolean> = {};
      const keys = Object.keys(flags);
      const length = keys.length;

      for (let i = 0; i < length; i++) {
        const flag = keys[i];
        const className = (names && names[flag]) || flag;
        const value = flags[flag];
        if (isNullOrUndefined(value)) {
          continue;
        }

        if ((flag === 'valid' || flag === 'invalid') && !flags.validated) {
          continue;
        }

        if (typeof className === 'string') {
          acc[className] = value;
        } else if (Array.isArray(className)) {
          className.forEach(cls => {
            acc[cls] = value;
          });
        }
      }

      return acc;
    });

    onBeforeUnmount(() => {
      $observer.unobserve(id);
    });

    onActivated(() => {
      isActive = true;
    });

    onDeactivated(() => {
      isActive = false;
    });

    const setFlags = (input: Partial<ValidationFlags>) => {
      Object.keys(input).forEach(flag => {
        flags[flag] = input[flag];
      });
    };

    const syncValue = (v: any) => {
      const evtVal = normalizeEventValue(v);
      value.value = evtVal;
      flags.changed = initialValue !== value;
    };

    const validateSilent = (): Promise<ValidationResult> => {
      setFlags({ pending: true });
      const rules = { ...resolvedRules, ...normalizedRules.value };
      Object.defineProperty(rules, '_$$isNormalized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      return validate(value.value, rules, {
        name: props.name || fieldName,
        // ...createLookup(this),
        bails: props.bails,
        skipIfEmpty: props.skipIfEmpty,
        isInitial: !initialized,
        customMessages: props.customMessages
      }).then(result => {
        setFlags({
          pending: false,
          valid: result.valid,
          invalid: !result.valid
        });

        return result;
      });
    };

    const reset = () => {
      errors.value = [];
      initialValue = value;
      const flags = createFlags();
      flags.required = isRequired.value;
      setFlags(flags);
      failedRules.value = {};
      validateSilent();
    };

    const applyResult = (result: Omit<ValidationResult, 'valid'>) => {
      errors.value = result.errors;
      failedRules.value = { ...(result.failedRules || {}) };
      setFlags({
        valid: !result.errors.length,
        passed: !result.errors.length,
        invalid: !!result.errors.length,
        failed: !!result.errors.length,
        validated: true,
        changed: value !== initialValue
      });
    };

    const validateCurrentValue = (...args: any[]): Promise<ValidationResult> => {
      if (args.length > 0) {
        syncValue(args[0]);
      }

      return validateSilent().then(result => {
        applyResult(result);

        return result;
      });
    };

    const slotProps = computed(() => {
      return {
        ...toRefs(flags),
        errors: errors.value,
        classes: classes.value,
        failedRules: failedRules.value,
        reset: () => reset(),
        validate: (...args: any[]) => validateCurrentValue(...args),
        ariaInput: {
          'aria-invalid': flags.invalid ? 'true' : 'false',
          'aria-required': isRequired.value ? 'true' : 'false',
          'aria-errormessage': `vee_${id}`
        },
        ariaMsg: {
          id: `vee_${id}`,
          'aria-live': errors.value.length ? 'assertive' : 'off'
        }
      };
    });

    function resolveId(): string {
      if (props.vid) {
        return props.vid;
      }

      if (props.name) {
        return props.name;
      }

      if (id) {
        return id;
      }

      if (fieldName) {
        return fieldName;
      }

      PROVIDER_COUNTER++;

      return `_vee_${PROVIDER_COUNTER}`;
    }

    function updateRenderingContextRefs() {
      const providedId = resolveId();

      // // Nothing has changed.
      // if (!isActive || (id === providedId && $observer.refs[id])) {
      //   return;
      // }

      // // vid was changed.
      // if (id !== providedId && $observer.refs[id] === vm) {
      //   vm.$_veeObserver.unobserve(id);
      // }

      id = providedId;
      // $observer.observe();
    }

    /**
     * Determines if a provider needs to run validation.
     */
    function shouldValidate(newVal: any) {
      // when an immediate/initial validation is needed and wasn't done before.
      if (!props.immediate) {
        return true;
      }

      // when the value changes for whatever reason.
      if (value.value !== newVal && normalizedEvents.value.length) {
        return true;
      }

      // when it needs validation due to props/cross-fields changes.
      if (needsValidation) {
        return true;
      }

      // when the initial value is undefined and the field wasn't rendered yet.
      if (!initialized && newVal === undefined) {
        return true;
      }

      return false;
    }

    const renderValidate = () => {
      if (props.immediate || flags.validated) {
        validateCurrentValue();
        return;
      }

      validateSilent();
    };

    function onRender(renderValue: any) {
      // if (!initialized) {
      //   initialValue = renderValue;
      // }

      // const validateNow = shouldValidate(renderValue);
      // needsValidation = false;
      value.value = renderValue;

      // if (!validateNow) {
      //   return;
      // }

      // if (initialized) {
      //   renderValidate();
      // }
    }

    function onBlur() {
      setFlags({ touched: true, untouched: false });
    }

    function onInput(e: Event) {
      syncValue(e); // track and keep the value updated.
      setFlags({ dirty: true, pristine: false });
    }

    function validateField(e: Event) {
      syncValue(e);
      validateCurrentValue();
    }

    // Adds all plugin listeners to the vnode.
    function listen(node: VNode) {
      const renderValue = findValue(node);
      onRender(renderValue?.value);
      addVNodeListener(node, inputEvtName, onInput);
      addVNodeListener(node, 'blur', onBlur);
      // add the validation listeners.
      normalizedEvents.value.forEach((evt: string) => {
        addVNodeListener(node, evt, validateField);
      });
      initialized = true;
    }

    return () => {
      // updateRenderingContextRefs();
      const children = normalizeChildren(ctx, slotProps.value);

      extractVNodes(children).forEach(input => {
        // resolved rules are not reactive because it has a new reference each time.
        // causing infinite render-loops.
        // So we are comparing them manually to decide if we need to validate or not.
        const resolved = getConfig().useConstraintAttrs ? resolveRules(input) : {};
        if (!isEqual(resolvedRules, resolved)) {
          needsValidation = true;
        }

        if (isHTMLNode(input)) {
          fieldName = input.props?.name || input.props?.id;
        }

        // cache the input eventName.
        inputEvtName = inputEvtName || getInputEventName(input);
        resolvedRules = resolved;
        listen(input);
      });

      return children;
    };
  }
};

function createObserver(): VeeObserver {
  return {
    refs: {},
    observe(vm: ProviderInstance) {
      this.refs[vm.id] = vm;
    },
    unobserve(id: string) {
      delete this.refs[id];
    }
  };
}
