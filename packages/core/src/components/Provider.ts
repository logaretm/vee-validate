import { ref, computed, SetupContext, VNode, inject } from 'vue';
import { modes, InteractionModeFactory } from '../modes';
import { normalizeRules } from '../utils/rules';
import {
  extractVNodes,
  normalizeChildren,
  resolveRules,
  isHTMLNode,
  getInputEventName,
  addVNodeListener
} from '../utils/vnode';
import { isCallable, isEqual, isNullOrUndefined } from '../utils';
import { getConfig } from '../config';
import { RuleContainer } from '../extend';
import { Flag, ValidationFlags, FormController } from '../types';
import { useField } from '../useField';

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
    const fieldName = ref(props.name || '');
    const $form = inject('$_veeObserver', undefined) as FormController | undefined;
    const { errors, failedRules, value, validate: validateField, handleChange, onBlur, reset, ...flags } = useField(
      fieldName,
      props.rules,
      {
        form: $form
      }
    );

    // let initialValue: any;
    // eslint-disable-next-line prefer-const
    let inputEvtName = '';
    // let initialized = false;
    const id = '';
    let resolvedRules = {};

    const normalizedRules = computed(() => {
      return normalizeRules(props.rules);
    });

    const unwrappedFlags = computed(() => {
      return Object.keys(flags).reduce((acc, key) => {
        acc[key] = flags[key as Flag].value;

        return acc;
      }, {} as ValidationFlags);
    });

    const interactionMode = computed(() => {
      const computeModeSetting = (isCallable(props.mode) ? props.mode : modes[props.mode]) as InteractionModeFactory;

      return computeModeSetting({
        errors: errors.value,
        flags: unwrappedFlags.value,
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
      flags.required.value = !!isRequired;

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
        const value = flags[flag as Flag].value;
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

    const slotProps = computed(() => {
      return {
        flags: unwrappedFlags.value,
        errors: errors.value,
        classes: classes.value,
        failedRules: failedRules.value,
        reset,
        validate: validateField,
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

    // Adds all plugin listeners to the vnode.
    function listen(node: VNode) {
      addVNodeListener(node, inputEvtName, handleChange);
      addVNodeListener(node, 'blur', onBlur);
      // add the validation listeners.
      normalizedEvents.value.forEach((evt: string) => {
        addVNodeListener(node, evt, validateField);
      });
      // initialized = true;
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
          // FIXME: Should validate!
        }

        const name = props.name || input.props?.name || input.props?.id || '';
        if (isHTMLNode(input) && fieldName.value !== name) {
          fieldName.value = name;
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
